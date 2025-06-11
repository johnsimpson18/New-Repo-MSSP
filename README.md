# MSSP ROI Calculator

A comprehensive web application built with React and TypeScript for calculating MSSP (Managed Security Service Provider) costs and determining customer pricing for cybersecurity platforms.

## 🚀 Features

### Core Functionality

- **Base License Management**: Display $15,000/year MSSP license with included features
- **Tenant Selection**: 5 different tenant tiers with specific pricing and capabilities
- **Add-ons System**: Two categories of add-ons (MSSP and End-Customer Tenant)
- **Pricing Controls**: Adjustable markup multiplier (1.5x - 5.0x) and billing period toggle
- **Real-time Calculations**: Instant cost breakdown, profit calculations, and margin analysis

### Tenant Tiers

| Tier | SKU | Price | Identifiers | Key Features |
|------|-----|-------|-------------|--------------|
| Micro Client | MSSP-TENANT-MICRO | $3,000 | 25 | Basic tenant |
| Starter Client | MSSP-TENANT-STARTER | $7,000 | 100 | + Threat Flow Generated Intelligence |
| Essential Client | MSSP-TENANT-ESSENTIAL | $12,000 | 400 | + Basic Alert Integrations |
| Core Customer | MSSP-TENANT-CORE | $28,000 | 1,000 | + Custom Intelligence, Unlimited View-Only licenses, Global Search |
| Enterprise Customer | MSSP-TENANT-ENTERPRISE | $50,000 | 4,000 | Full feature set |

### Add-ons Available

**MSSP Add-ons:**
- Individual Takedowns ($500)
- 10 Takedowns Bundle ($3,000)
- Additional 100/200 searches per month ($5,000/$8,000)

**End-Customer Tenant Add-ons:**
- Supply Chain Exposure (Micro: $3,000, Others: $8,000)
- Unlimited view-only licenses ($750)
- Additional identifiers (25-10k range, $500-$20,000)
- Threat Flow Custom Intelligence ($8,000)

## 🎨 Design Features

- **Modern UI**: Professional B2B appearance with blue/navy color scheme
- **Responsive Design**: Mobile-friendly layout that works on all devices
- **Card-based Layout**: Clean, organized sections with subtle shadows
- **Interactive Elements**: Hover effects, smooth transitions, and real-time updates
- **Gradient Backgrounds**: Attractive visual appeal suitable for sales presentations

## 🛠️ Technical Stack

- **React 19.1.0** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS 4.1.8** for styling
- **ESLint** for code quality
- Custom CSS for advanced styling and animations

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mssp-roi-calculator-v2
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 📱 Usage Guide

### Step 1: Base License
The base MSSP license ($15,000/year) is automatically included and shows all included features.

### Step 2: Add Customer Tenants
- Browse the 5 available tenant tiers
- Click "Add Tenant" for any tier to include it in your calculation
- Remove tenants using the X button in the selected tenants list

### Step 3: Configure Add-ons
- Use quantity selectors (0-10) for MSSP add-ons
- Configure end-customer tenant add-ons as needed
- All calculations update in real-time

### Step 4: Set Pricing Controls
- Adjust markup multiplier using the slider (1.5x to 5.0x)
- Toggle between Monthly and Annual pricing views

### Step 5: Review Results
The sidebar displays:
- Complete cost breakdown
- Your total costs
- Customer pricing (with markup applied)
- Profit calculations and margin percentage

## 🎯 Business Use Cases

- **Sales Presentations**: Professional tool for demonstrating value to prospects
- **Internal Planning**: Calculate costs for different customer scenarios
- **Pricing Strategy**: Test different markup multipliers and configurations
- **Proposal Generation**: Quick cost calculations for RFPs and quotes

## 🔧 Customization

The application is built with modularity in mind. Key areas for customization:

- **Pricing Data**: Update constants in `App.tsx` for new pricing
- **Styling**: Modify `App.css` and Tailwind classes for branding
- **Features**: Add new tenant types or add-ons by extending the data structures
- **Calculations**: Customize the pricing logic in the `calculations` useMemo hook

## 📊 Key Metrics Calculated

- **Total Cost**: Base license + tenants + add-ons
- **Customer Price**: Total cost × markup multiplier
- **Profit**: Customer price - total cost
- **Profit Margin**: (Profit ÷ customer price) × 100

## 🐛 Troubleshooting

### Common Issues

1. **Styling not loading**: Ensure Tailwind CSS is properly configured
2. **Calculations incorrect**: Check that all numeric inputs are properly parsed
3. **Responsive issues**: Test on different screen sizes and adjust CSS media queries

### Development Issues

- Ensure Node.js version compatibility
- Clear npm cache if experiencing installation issues: `npm cache clean --force`
- Restart development server after making configuration changes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add feature description'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 📝 License

This project is proprietary software for MSSP programs.

## 📞 Support

For technical support or feature requests, please contact the development team.
