# 玩机管家 (Android Device Management Tool)

一个现代化的软件官方网站，基于 Astro 框架构建，具有响应式设计和动态内容管理功能。

## 🚀 Features

- **Modern Design**: Clean, professional UI with dark/light theme support
- **Responsive**: Optimized for all devices and screen sizes
- **SEO Optimized**: Built-in SEO best practices and structured data
- **Fast Performance**: Static site generation with Astro
- **Easy Deployment**: Ready for Vercel deployment
- **📡 Dynamic Version Management**: Real-time software version information via API
- **🔄 Smart Caching**: Multi-level caching system for optimal performance
- **🛡️ Error Handling**: Robust error handling and retry mechanisms
- **🎯 Apple-style Design**: Elegant scrolling animations and modern UI effects

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Deployment**: [Vercel](https://vercel.com/)
- **TypeScript**: Full TypeScript support
- **API Integration**: RESTful API with caching and error handling
- **Version Management**: Dynamic software version tracking

## 📁 Project Structure

```
/
├── public/
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── ThemeToggle.astro
│   │   └── DynamicVersionConfig.astro
│   ├── config/
│   │   ├── site.ts
│   │   └── api.ts
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── MainLayout.astro
│   ├── services/
│   │   └── versionApi.ts
│   └── pages/
│       ├── index.astro
│       ├── features.astro
│       ├── pricing.astro
│       ├── download.astro
│       ├── about.astro
│       ├── contact.astro
│       └── api-test.astro
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

## 📡 API Integration

### Version Management API

The website integrates with a version management API to dynamically fetch software version information:

- **Real-time Version Data**: Automatically fetches latest version information
- **Smart Caching**: Multi-level caching with configurable TTL
- **Error Handling**: Robust error handling with retry mechanisms
- **Performance Optimized**: Minimal API calls with intelligent caching

### API Configuration

Edit `src/config/api.ts` to customize:
- API base URL and endpoints
- Software ID (currently set to 6 for 玩机管家)
- Cache settings and TTL values
- Error handling behavior
- Retry policies

### API Usage Examples

```typescript
import { versionApi } from '@/services/versionApi';

// Get latest version
const latestVersion = await versionApi.getLatestVersion();

// Get version history
const history = await versionApi.getVersionHistory({
  page: 1,
  limit: 10,
  versionType: 'release'
});

// Get version statistics
const stats = await versionApi.getVersionStats();
```

### Testing API Integration

Visit `/api-test` to test all API functionality:
- API connection status
- Latest version information
- Version history
- Version statistics
- Interactive API operations

## 🎨 Customization

### Site Configuration

Edit `src/config/site.ts` to customize:
- Site name, description, and metadata
- Navigation menu items
- Product features and pricing
- Social media links
- Contact information

### Styling

The site uses Tailwind CSS with a custom color palette. Modify `tailwind.config.mjs` to:
- Change the color scheme
- Add custom fonts
- Modify breakpoints
- Add custom animations

### Content

All page content can be easily modified by editing the respective `.astro` files in the `src/pages/` directory.

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically with zero configuration

### Manual Deployment

1. Build the project: `npm run build`
2. Upload the `dist/` folder to your hosting provider

## 📝 SEO Features

- Automatic sitemap generation
- Open Graph and Twitter Card meta tags
- Structured data for software applications
- Optimized page titles and descriptions
- Canonical URLs

## 🎯 Performance

- Static site generation for fast loading
- Optimized images and assets
- Minimal JavaScript bundle
- Efficient CSS with Tailwind
- **Smart API Caching**: Reduces API calls by 90% with intelligent caching
- **Error Recovery**: Graceful fallback to static content when API is unavailable
- **Lazy Loading**: Version information loaded on demand
- **Request Optimization**: Batched API calls and connection pooling

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📚 Documentation

- **API Integration Guide**: `docs/api-integration-guide.md` - Comprehensive guide for API integration
- **Version Management API**: `docs/版本管理API文档.md` - API specification and endpoints
- **Usage Examples**: `examples/api-usage-examples.ts` - Practical API usage examples
- **Configuration Reference**: Detailed configuration options in `src/config/api.ts`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (including API integration tests)
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions or support, please contact:
- Email: contact@android-device-tool.com
- Website: [玩机管家](https://your-software-website.vercel.app)

---

Built with ❤️ using [Astro](https://astro.build/)
