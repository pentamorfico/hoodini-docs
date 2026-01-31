/**
 * Sync Documentation Script for Nextra 4
 * Downloads docs directly from GitHub repos (no local clone needed)
 * Supports private repos via gh CLI authentication or GITHUB_TOKEN
 */
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// GitHub configuration
const GITHUB_ORG = 'pentamorfico';
const GITHUB_BRANCH = 'main';

// Try to get token from gh CLI first, then fall back to env variable
function getGitHubToken() {
  // First try environment variable
  if (process.env.GITHUB_TOKEN) {
    return process.env.GITHUB_TOKEN;
  }
  
  // Try gh CLI
  try {
    const token = execSync('gh auth token', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
    if (token) {
      console.log('🔑 Using GitHub token from gh CLI\n');
      return token;
    }
  } catch (err) {
    // gh not installed or not authenticated
  }
  
  return null;
}

const GITHUB_TOKEN = getGitHubToken();

if (!GITHUB_TOKEN) {
  console.warn('⚠️  No GitHub authentication found. Private repos will not be accessible.');
  console.warn('   Run: gh auth login');
  console.warn('   Or set: export GITHUB_TOKEN=ghp_your_token_here\n');
}

// Clean up legacy docs dir
const legacyDocsDir = path.join(rootDir, 'content/docs');
if (fs.existsSync(legacyDocsDir)) {
  fs.removeSync(legacyDocsDir);
}

const apiDownloadDir = path.join(rootDir, 'public/api');
fs.ensureDirSync(apiDownloadDir);

/**
 * Escape special characters that MDX interprets as JSX
 * But preserve import statements, JSX component syntax, and code blocks
 */
function escapeMdxSpecialChars(content) {
  const lines = content.split('\n');
  let inCodeBlock = false;
  
  const result = lines.map(line => {
    // Track code block state
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      return line;
    }
    
    // Don't escape anything inside code blocks
    if (inCodeBlock) return line;
    
    // Don't escape import statements
    if (line.trim().startsWith('import ')) return line;
    
    // Don't escape export statements
    if (line.trim().startsWith('export ')) return line;
    
    // Don't escape lines with JSX components (< followed by uppercase or known Nextra components)
    if (/<(Tabs|Steps|Callout|Cards|FileTree|Bleed|Code)/.test(line)) return line;
    if (/<\/?(Tabs|Steps|Callout|Cards|FileTree|Bleed|Code)/.test(line)) return line;
    
    // Don't escape lines that look like JSX (< followed by uppercase letter)
    if (/<[A-Z]/.test(line)) return line;
    
    // Escape standalone tags like <output_dir> but not inside inline code
    let escapedLine = line;
    
    // Escape tags like <output_dir> that aren't valid HTML/JSX (but not in inline code)
    escapedLine = escapedLine.replace(/(<[a-z][a-z_]*>)/gi, (match) => {
      const tagName = match.slice(1, -1).toLowerCase();
      const htmlTags = ['div', 'span', 'p', 'a', 'img', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'code', 'pre', 'br', 'hr', 'em', 'strong', 'b', 'i', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'section', 'article', 'nav', 'header', 'footer', 'main', 'aside'];
      if (htmlTags.includes(tagName)) return match;
      return `\`${match}\``;
    });
    
    // For inline code, split and only escape outside of backticks
    const inlineCodeRegex = /(`[^`]+`)/g;
    const parts = escapedLine.split(inlineCodeRegex);
    
    return parts.map((part, i) => {
      if (i % 2 === 0) {
        // Not in inline code - escape braces in regular text
        return part.replace(/\{([^}]*)\}/g, (match, inner) => {
          // Don't escape if it's a JSX expression (contains quotes, function calls, etc)
          if (/['"\[\]()]/.test(inner)) return match;
          return `&#123;${inner}&#125;`;
        });
      }
      return part;
    }).join('');
  }).join('\n');
  
  return result;
}

/**
 * Fetch a file from GitHub raw content
 */
async function fetchGitHubFile(repo, filePath) {
  const url = `https://raw.githubusercontent.com/${GITHUB_ORG}/${repo}/${GITHUB_BRANCH}/${filePath}`;
  try {
    const headers = {};
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }
    const response = await fetch(url, { headers });
    if (!response.ok) {
      return null;
    }
    return await response.text();
  } catch (err) {
    return null;
  }
}

/**
 * Fetch directory listing from GitHub API
 */
async function fetchGitHubDir(repo, dirPath) {
  const url = `https://api.github.com/repos/${GITHUB_ORG}/${repo}/contents/${dirPath}?ref=${GITHUB_BRANCH}`;
  try {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'hoodini-docs-sync'
    };
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }
    const response = await fetch(url, { headers });
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (err) {
    return null;
  }
}

/**
 * Recursively download a directory from GitHub
 * Returns { count, remoteFiles } where remoteFiles is a Set of all synced file paths
 */
async function downloadGitHubDir(repo, remotePath, localPath, options = {}) {
  const { skipApi = true, skipExisting = true } = options;
  let count = 0;
  const remoteFiles = new Set();
  
  const items = await fetchGitHubDir(repo, remotePath);
  if (!items || !Array.isArray(items)) {
    return { count, remoteFiles };
  }
  
  fs.ensureDirSync(localPath);
  
  for (const item of items) {
    // Skip hidden files
    if (item.name.startsWith('.')) continue;
    
    // Skip api folder if requested
    if (skipApi && item.name === 'api') continue;
    
    const localItemPath = path.join(localPath, item.name);
    
    if (item.type === 'dir') {
      const subResult = await downloadGitHubDir(repo, item.path, localItemPath, options);
      count += subResult.count;
      subResult.remoteFiles.forEach(f => remoteFiles.add(f));
    } else if (item.type === 'file') {
      const ext = path.extname(item.name);
      
      // Handle _meta.json
      if (item.name === '_meta.json') {
        remoteFiles.add(localItemPath);
        if (!fs.existsSync(localItemPath)) {
          const content = await fetchGitHubFile(repo, item.path);
          if (content) {
            fs.writeFileSync(localItemPath, content);
            count++;
          }
        }
        continue;
      }
      
      // Handle markdown files
      if (['.md', '.mdx'].includes(ext)) {
        let destPath = localItemPath;
        if (ext === '.md') {
          destPath = destPath.replace(/\.md$/, '.mdx');
        }
        
        // Track the file as existing in remote
        remoteFiles.add(destPath);
        
        // Skip if destination already exists (preserve custom content)
        if (skipExisting && fs.existsSync(destPath)) {
          continue;
        }
        
        const content = await fetchGitHubFile(repo, item.path);
        if (content) {
          const escapedContent = escapeMdxSpecialChars(content);
          fs.writeFileSync(destPath, escapedContent);
          count++;
        }
      }
      
      // Handle images
      if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].includes(ext)) {
        const imgDest = path.join(rootDir, 'public/images', item.name);
        remoteFiles.add(imgDest);
        if (!fs.existsSync(imgDest)) {
          const headers = {};
          if (GITHUB_TOKEN) {
            headers['Authorization'] = `token ${GITHUB_TOKEN}`;
          }
          const response = await fetch(item.download_url, { headers });
          if (response.ok) {
            const buffer = Buffer.from(await response.arrayBuffer());
            fs.writeFileSync(imgDest, buffer);
            count++;
          }
        }
      }
    }
  }
  
  return { count, remoteFiles };
}

const projects = [
  {
    name: 'hoodini',
    repo: 'hoodini',
    title: 'Hoodini CLI',
    docsPath: 'docs',
    dest: path.join(rootDir, 'content/hoodini'),
  },
  {
    name: 'hoodini-viz',
    repo: 'hoodini-viz',
    title: 'Hoodini Viz',
    docsPath: 'docs',
    dest: path.join(rootDir, 'content/hoodini-viz'),
  },
  {
    name: 'hoodini-colab',
    repo: 'hoodini-colab',
    title: 'Hoodini Colab',
    docsPath: 'docs',
    dest: path.join(rootDir, 'content/hoodini-colab'),
  }
];

/**
 * Ensure project has basic scaffold
 */
function ensureProjectScaffold(project) {
  const dest = project.dest;
  const indexPath = path.join(dest, 'index.mdx');
  const metaPath = path.join(dest, '_meta.json');
  const apiDir = path.join(dest, 'api');
  const apiMetaPath = path.join(apiDir, '_meta.json');

  fs.ensureDirSync(dest);
  fs.ensureDirSync(apiDir);

  if (!fs.existsSync(indexPath)) {
    fs.outputFileSync(
      indexPath,
      `# ${project.title}\n\nDocumentation coming soon.\n`
    );
  }

  if (!fs.existsSync(metaPath)) {
    fs.outputJsonSync(
      metaPath,
      {
        index: project.title,
        api: {
          title: 'API',
          type: 'page',
        },
      },
      { spaces: 2 }
    );
  }

  if (!fs.existsSync(apiMetaPath)) {
    fs.outputJsonSync(apiMetaPath, { reference: 'API Reference' }, { spaces: 2 });
  }
}

/**
 * Remove local files that no longer exist in remote
 * Preserves _meta.json, api/ folder, playground/ folder, index.mdx (scaffold), and other local-only files
 */
function removeOrphanedFiles(localDir, remoteFiles, options = {}) {
  const { dryRun = false } = options;
  let removed = 0;
  
  if (!fs.existsSync(localDir)) return removed;
  
  const localFiles = fs.readdirSync(localDir);
  
  for (const file of localFiles) {
    const localPath = path.join(localDir, file);
    const stat = fs.statSync(localPath);
    
    // Skip api folder - it's generated separately
    if (file === 'api') continue;
    
    // Skip playground folder - local-only interactive examples
    if (file === 'playground') continue;
    
    // Skip _meta.json - may have local customizations
    if (file === '_meta.json') continue;
    
    // Skip index.mdx if it's a scaffold (no remote files means no docs from source)
    if (file === 'index.mdx' && remoteFiles.size === 0) continue;
    
    if (stat.isDirectory()) {
      // Recursively check subdirectories
      removed += removeOrphanedFiles(localPath, remoteFiles, options);
      
      // Remove empty directories
      if (fs.readdirSync(localPath).length === 0) {
        if (!dryRun) fs.rmdirSync(localPath);
        removed++;
      }
    } else if (stat.isFile()) {
      // Check if file exists in remote
      if (!remoteFiles.has(localPath)) {
        // Only remove .mdx files (synced docs), but preserve index.mdx if no remote docs
        if (localPath.endsWith('.mdx')) {
          // Don't remove index.mdx if there are no remote docs (it's scaffold)
          if (file === 'index.mdx' && remoteFiles.size === 0) continue;
          
          if (!dryRun) fs.unlinkSync(localPath);
          removed++;
          console.log(`   🗑️  Removed: ${path.basename(localPath)}`);
        }
      }
    }
  }
  
  return removed;
}

// Parse command line arguments
const args = process.argv.slice(2);
const forceSync = args.includes('--force') || args.includes('-f');

// Main execution
async function main() {
  console.log('🔄 Syncing documentation from GitHub...\n');
  console.log(`   Organization: ${GITHUB_ORG}`);
  console.log(`   Branch: ${GITHUB_BRANCH}`);
  if (forceSync) {
    console.log(`   Mode: FORCE (overwriting existing files)`);
  }
  console.log('');

  fs.ensureDirSync(path.join(rootDir, 'public/images'));

  for (const project of projects) {
    console.log(`📦 ${project.name}: Fetching from github.com/${GITHUB_ORG}/${project.repo}...`);
    
    // Download docs from GitHub
    const result = await downloadGitHubDir(project.repo, project.docsPath, project.dest, {
      skipApi: true,
      skipExisting: !forceSync
    });
    
    // Also try to download images
    const imgResult = await downloadGitHubDir(project.repo, `${project.docsPath}/images`, path.join(rootDir, 'public/images'), {
      skipApi: false,
      skipExisting: !forceSync
    });
    
    // Merge remote files from both syncs
    const allRemoteFiles = new Set([...result.remoteFiles, ...imgResult.remoteFiles]);
    
    // Remove orphaned files (files that no longer exist in remote)
    const removedCount = removeOrphanedFiles(project.dest, allRemoteFiles);
    
    // Ensure scaffold exists
    ensureProjectScaffold(project);
    
    const syncedMsg = result.count > 0 ? `${result.count} synced` : 'up to date';
    const removedMsg = removedCount > 0 ? `, ${removedCount} removed` : '';
    console.log(`   ✅ ${syncedMsg}${removedMsg}\n`);
  }

  console.log('✨ Sync complete!');
  console.log('\n💡 Note: API reference docs are generated separately.');
  console.log('   Run the full build to regenerate API docs from source code.\n');
}

main().catch(err => {
  console.error('❌ Sync failed:', err.message);
  process.exit(1);
});
