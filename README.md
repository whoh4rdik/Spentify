# Ì≤∞ Spentify AI - Smart Expense Tracker

<div align="center">

![Spentify AI Logo](public/spentify-logo.png)

**An intelligent expense tracking application powered by AI for smarter financial management**

[![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.11.1-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

[Ì∫Ä Live Demo](https://your-demo-link.com) ‚Ä¢ [Ì≥ñ Documentation](https://github.com/whoh4rdik/Spentify-AI-New/wiki) ‚Ä¢ [Ì∞õ Report Bug](https://github.com/whoh4rdik/Spentify-AI-New/issues)

</div>

## Ìºü Features

### Ì¥ñ AI-Powered Intelligence
- **Smart Categorization**: Automatically suggests expense categories using AI
- **Financial Insights**: Personalized spending analysis and recommendations
- **Interactive AI Assistant**: Get detailed explanations about your spending patterns
- **Predictive Analytics**: Forecast future expenses based on historical data

### Ì≤º Core Functionality
- **Expense Management**: Add, edit, delete, and organize expenses effortlessly
- **Real-time Analytics**: Interactive charts and visualizations
- **Category Management**: Customizable expense categories
- **Data Export**: Export your financial data in various formats
- **Responsive Design**: Seamless experience across all devices

### Ì¥ê Security & Authentication
- **Secure Authentication**: Powered by Clerk for robust user management
- **Data Privacy**: Your financial data is encrypted and secure
- **Role-based Access**: Multi-level user permissions

## Ìª†Ô∏è Tech Stack

### Frontend
- **Framework**: Next.js 15.3.5 with App Router
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.4.17
- **UI Components**: Custom React components
- **Charts**: Chart.js & React Chart.js 2
- **State Management**: React Context API

### Backend
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **AI Integration**: OpenAI GPT API
- **API**: Next.js API Routes

### Deployment & DevOps
- **Hosting**: Vercel (recommended)
- **Database**: Railway/Supabase/PlanetScale
- **CI/CD**: GitHub Actions
- **Monitoring**: Built-in analytics

## Ì∫Ä Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database
- Clerk account for authentication
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/whoh4rdik/Spentify-AI-New.git
   cd Spentify-AI-New
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   DATABASE_URL="your-postgresql-connection-string"
   
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
   CLERK_SECRET_KEY="your-clerk-secret-key"
   NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
   NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
   
   # OpenAI
   OPENAI_API_KEY="your-openai-api-key"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Ì≥± Screenshots

<details>
<summary>Click to view screenshots</summary>

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Expense Analytics
![Analytics](screenshots/analytics.png)

### AI Insights
![AI Insights](screenshots/ai-insights.png)

</details>

## ÌøóÔ∏è Project Structure

```
Spentify-AI-New/
‚îú‚îÄ‚îÄ app/                    # Next.js App Router
‚îÇ   ‚îú‚îÄ‚îÄ (auth)/            # Authentication routes
‚îÇ   ‚îú‚îÄ‚îÄ actions/           # Server actions
‚îÇ   ‚îú‚îÄ‚îÄ api/               # API routes
‚îÇ   ‚îî‚îÄ‚îÄ globals.css        # Global styles
‚îú‚îÄ‚îÄ components/            # React components
‚îÇ   ‚îú‚îÄ‚îÄ ui/               # Reusable UI components
‚îÇ   ‚îî‚îÄ‚îÄ charts/           # Chart components
‚îú‚îÄ‚îÄ contexts/             # React contexts
‚îú‚îÄ‚îÄ lib/                  # Utility functions
‚îú‚îÄ‚îÄ prisma/              # Database schema & migrations
‚îú‚îÄ‚îÄ public/              # Static assets
‚îú‚îÄ‚îÄ types/               # TypeScript type definitions
‚îî‚îÄ‚îÄ README.md
```

## Ì¥ß Configuration

### Database Setup
1. Create a PostgreSQL database
2. Update `DATABASE_URL` in your `.env.local`
3. Run migrations: `npx prisma db push`

### Authentication Setup
1. Create a Clerk application
2. Configure sign-in/sign-up pages
3. Add your Clerk keys to `.env.local`

### AI Integration
1. Get an OpenAI API key
2. Add it to your environment variables
3. Customize AI prompts in `lib/ai.ts`

## Ì∫Ä Deployment

### Deploy on Vercel (Recommended)

1. **Connect your GitHub repository**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   
2. **Configure environment variables**
   - Add all your `.env.local` variables to Vercel
   
3. **Deploy**
   - Vercel will automatically deploy your app

### Alternative Deployment Options
- **Netlify**: Configure build settings and environment variables
- **Railway**: Direct deployment with database included
- **Docker**: Use the included Dockerfile for containerized deployment

## Ì≥ä API Documentation

### Expense Endpoints
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/[id]` - Update expense
- `DELETE /api/expenses/[id]` - Delete expense

### AI Endpoints
- `POST /api/ai/categorize` - Get AI category suggestion
- `POST /api/ai/insights` - Generate spending insights
- `POST /api/ai/chat` - Interactive AI assistant

## Ì¥ù Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Ì≥Ñ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Ì±®‚ÄçÌ≤ª Author

**Hardik Kaushik**
- GitHub: [@whoh4rdik](https://github.com/whoh4rdik)
- Email: hardikkaushik594@gmail.com

## Ìπè Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Clerk](https://clerk.dev/) for authentication
- [OpenAI](https://openai.com/) for AI capabilities
- [Prisma](https://prisma.io/) for database management
- [Tailwind CSS](https://tailwindcss.com/) for styling

## Ì≥à Roadmap

- [ ] Mobile app (React Native)
- [ ] Budget planning features
- [ ] Receipt scanning with OCR
- [ ] Multi-currency support
- [ ] Advanced reporting
- [ ] Team collaboration features
- [ ] Integration with banking APIs

---

<div align="center">

**‚≠ê Star this repository if you find it helpful!**

[Report Bug](https://github.com/whoh4rdik/Spentify-AI-New/issues) ‚Ä¢ [Request Feature](https://github.com/whoh4rdik/Spentify-AI-New/issues) ‚Ä¢ [Join Discord](https://discord.gg/your-discord)

</div>
