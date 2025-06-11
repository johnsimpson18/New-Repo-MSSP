# Deployment Guide - MSSP ROI Calculator

This guide covers different deployment options for the MSSP ROI Calculator application.

## 🚀 Quick Deployment Options

### 1. Netlify (Recommended)

**Steps:**
1. Build the application: `npm run build`
2. Upload the `dist/` folder to Netlify
3. Configure custom domain if needed

**Via Git (Automated):**
1. Push code to GitHub/GitLab
2. Connect repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy automatically on every push

### 2. Vercel

**Steps:**
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project root
3. Follow the prompts
4. Automatic deployment on git push

### 3. GitHub Pages

**Steps:**
1. Build: `npm run build`
2. Install gh-pages: `npm install --save-dev gh-pages`
3. Add to package.json scripts:
   ```json
   "deploy": "gh-pages -d dist"
   ```
4. Run: `npm run deploy`

### 4. Traditional Web Server

**Requirements:**
- Any web server (Apache, Nginx, IIS)
- Static file hosting capability

**Steps:**
1. Build: `npm run build`
2. Copy contents of `dist/` folder to web server root
3. Configure server for SPA routing (if needed)

## 🔧 Environment Configuration

### Build Optimization

For production builds, the following optimizations are automatically applied:
- Code minification
- CSS optimization
- Tree shaking for unused code
- Asset optimization

### Custom Configuration

If you need custom build settings, modify `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Add custom build options here
  },
  base: '/', // Change if deploying to subdirectory
})
```

## 🌐 Domain & SSL Configuration

### Custom Domain
1. Update DNS settings to point to hosting provider
2. Configure SSL certificate (most providers offer free SSL)
3. Set up redirects (www to non-www or vice versa)

### HTTPS Configuration
All modern hosting providers (Netlify, Vercel, etc.) provide automatic HTTPS. For traditional servers:
- Use Let's Encrypt for free SSL certificates
- Configure proper security headers
- Set up HTTPS redirects

## 📊 Performance Optimization

### Pre-deployment Checklist
- [ ] Run `npm run build` successfully
- [ ] Test in production mode locally: `npm run preview`
- [ ] Verify all calculations work correctly
- [ ] Test responsive design on multiple devices
- [ ] Check browser compatibility
- [ ] Validate accessibility features

### Performance Monitoring
- Use Lighthouse for performance auditing
- Monitor Core Web Vitals
- Set up analytics (Google Analytics, etc.)

## 🔒 Security Considerations

### Content Security Policy (CSP)
Add CSP headers for enhanced security:
```
Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'
```

### Additional Security Headers
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## 🚨 Troubleshooting Deployment Issues

### Common Issues

1. **Build Fails**
   - Check Node.js version compatibility
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall: `rm -rf node_modules && npm install`

2. **Blank Page After Deployment**
   - Verify base URL in vite.config.ts
   - Check browser console for errors
   - Ensure all assets are loading correctly

3. **Styling Issues**
   - Verify CSS files are included in build
   - Check for missing Tailwind configuration
   - Ensure custom CSS is properly imported

4. **Routing Issues (if adding routing later)**
   - Configure server for SPA routing
   - Set up proper fallback to index.html

### Performance Issues
- Enable gzip compression on server
- Use CDN for asset delivery
- Optimize images and assets
- Enable browser caching

## 📞 Support

For deployment issues or questions:
1. Check the hosting provider's documentation
2. Review build logs for specific error messages
3. Test locally with production build first
4. Contact development team for assistance

## 🔄 CI/CD Pipeline (Advanced)

For automated deployments, consider setting up:

### GitHub Actions Example
```yaml
name: Deploy to Production
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Deploy
        # Add deployment steps here
```

This ensures consistent, automated deployments every time code is pushed to the main branch. 