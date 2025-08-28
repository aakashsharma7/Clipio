# Clipio - AI-Powered Design Asset Management Platform

A modern, scalable SaaS platform for capturing, organizing, and collaborating on design assets with AI-powered tagging and intelligent organization features.

## ✨ Features

### 🎯 Core Functionality
- **AI-Powered Asset Tagging** - Automatic categorization using advanced AI algorithms
- **Smart Search & Discovery** - Find assets instantly with semantic search and visual similarity
- **Collection Management** - Organize assets into thematic collections with drag-and-drop
- **Real-time Collaboration** - Share collections and collaborate with team members
- **Design Feedback** - Get instant AI-powered design suggestions and feedback

### 🛠 Technical Features
- **Modern Tech Stack** - Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Authentication** - Auth0 integration with social login support
- **Database** - Supabase for real-time data and file storage
- **AI Integration** - Python-based AI service for tagging and similarity analysis
- **Real-time Updates** - WebSocket integration for live collaboration
- **Responsive Design** - Beautiful, modern UI that works on all devices

### 🔌 Integrations
- **Design Tools** - Figma, Adobe Creative Suite, Sketch
- **Productivity** - Notion, Slack, Discord
- **Storage** - Google Drive, Dropbox, OneDrive
- **Version Control** - GitHub, GitLab integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Auth0 account

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/clipio-saas.git
cd clipio-saas
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# Auth0 Configuration
AUTH0_SECRET=your_auth0_secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret

# AI Service (Optional)
OPENAI_API_KEY=your_openai_api_key
```

### 4. Database Setup
Run the following SQL in your Supabase SQL editor:

```sql
-- Create assets table
CREATE TABLE assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  ai_tags TEXT[] DEFAULT '{}',
  collection_id UUID REFERENCES collections(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create collections table
CREATE TABLE collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free',
  storage_used BIGINT DEFAULT 0,
  storage_limit BIGINT DEFAULT 1073741824, -- 1GB
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create collaborations table
CREATE TABLE collaborations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  role TEXT CHECK (role IN ('viewer', 'editor', 'admin')) DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('info', 'success', 'warning', 'error')) DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own assets" ON assets FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert own assets" ON assets FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own assets" ON assets FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete own assets" ON assets FOR DELETE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view own collections" ON collections FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert own collections" ON collections FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own collections" ON collections FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete own collections" ON collections FOR DELETE USING (auth.uid()::text = user_id);
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗 Project Structure

```
clipio-saas/
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── AssetUpload.tsx   # Asset upload component
├── lib/                  # Utility libraries
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # Utility functions
├── public/               # Static assets
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose setup
└── package.json          # Dependencies
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build the image manually
docker build -t clipio-saas .
docker run -p 3000:3000 clipio-saas
```

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Kubernetes Deployment
```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run type checking
npm run type-check

# Run linting
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@clipio.com
- 💬 Discord: [Join our community](https://discord.gg/clipio)
- 📖 Documentation: [docs.clipio.com](https://docs.clipio.com)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/clipio-saas/issues)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Auth0](https://auth0.com/) for authentication
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Lucide](https://lucide.dev/) for beautiful icons

---

Made with ❤️ by the Clipio team
