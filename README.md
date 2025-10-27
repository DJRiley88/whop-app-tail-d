# Tailed - Gamified Tail-the-Slip App

A comprehensive Whop app for sports-betting creators and their communities. Members earn points by "tailing" betting slips within time windows, compete on leaderboards, and win prizes from creator-defined pools.

## 🎯 Features

### For Creators (Admins)
- **Challenge Management**: Create, edit, and manage time-boxed challenges
- **Bet Posting**: Post betting slips with configurable tail windows
- **Analytics Dashboard**: Track tails, engagement, and performance metrics
- **Prize Pool Management**: Set custom payout percentages and prize amounts
- **Real-time Monitoring**: Live leaderboards and tail tracking

### For Members (Fans)
- **Tail Betting Slips**: Click links within time windows to earn points
- **Leaderboard Competition**: Real-time rankings with tie handling
- **Progress Tracking**: Personal stats and tail history
- **Prize Opportunities**: Win shares of creator-defined prize pools
- **Challenge Discovery**: Browse and join active challenges

## 🏗️ Architecture

### Core Objects
- **Challenges**: Time-boxed contests with prize pools and payout structures
- **Bets**: Individual betting slips with tail windows and validation rules
- **Tails**: Member clicks on bets with point scoring and anti-abuse measures
- **Leaderboards**: Real-time rankings with configurable tie handling

### Database Schema
- **Users**: Whop user integration with admin permissions
- **Challenges**: Contest management with status tracking
- **Bets**: Slip posting with time window validation
- **Tails**: Point tracking with anti-abuse measures
- **Analytics**: Performance metrics and caching

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- PostgreSQL database
- Whop developer account

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository>
   cd whop-app
   pnpm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. **Configure database**
   ```bash
   # Set your PostgreSQL connection string
   echo "POSTGRES_URL_NON_POOLING=postgresql://user:password@localhost:5432/tailed" >> .env
   ```

4. **Run database migrations**
   ```bash
   pnpm run migrate
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

### Environment Variables

```env
# Whop Configuration
WHOP_API_KEY=your_whop_api_key
NEXT_PUBLIC_WHOP_AGENT_USER_ID=your_agent_user_id
NEXT_PUBLIC_WHOP_APP_ID=your_app_id
NEXT_PUBLIC_WHOP_COMPANY_ID=your_company_id

# Database
POSTGRES_URL_NON_POOLING=postgresql://user:password@localhost:5432/tailed
```

## 📱 Usage

### For Creators

1. **Create a Challenge**
   - Set title, description, and dates
   - Define prize pool and payout percentages
   - Choose tie handling policy (split or tiebreaker)

2. **Post Bets**
   - Add betting slip details
   - Set tail window duration
   - Choose sportsbook and league

3. **Monitor Performance**
   - View real-time analytics
   - Track tail conversion rates
   - Monitor leaderboard activity

### For Members

1. **Join Challenges**
   - Browse active challenges
   - View prize pools and rules
   - Click "Join Challenge"

2. **Tail Bets**
   - Click betting slip links within time windows
   - Earn 1 point per valid tail
   - Track your progress and ranking

3. **Compete for Prizes**
   - Climb the leaderboard
   - Win shares of prize pools
   - View your tail history

## 🔧 API Endpoints

### Challenges
- `GET /api/challenges` - List challenges
- `POST /api/challenges` - Create challenge
- `GET /api/challenges/[id]` - Get challenge details
- `PATCH /api/challenges/[id]` - Update challenge status

### Bets
- `GET /api/bets?challengeId=[id]` - List bets for challenge
- `POST /api/bets` - Create new bet

### Tails
- `GET /api/tails` - Get user's tail history
- `POST /api/tails` - Record a tail attempt

### Leaderboard
- `GET /api/leaderboard/[challengeId]` - Get challenge leaderboard

### Analytics
- `GET /api/analytics` - Get creator analytics

## 🎮 Game Mechanics

### Point System
- **1 point per valid tail** within the time window
- **0 points** for tails outside the window
- **One point per member per bet** (prevents abuse)
- **Real-time leaderboard updates**

### Time Windows
- **Configurable duration** (e.g., 60 minutes)
- **Clear countdown timers** on bet cards
- **Automatic expiration** when window closes
- **Transparent rules** for all participants

### Tie Handling
- **Split Policy**: Tied members split the combined payout
- **Tiebreaker Policy**: Earliest last valid tail wins higher rank
- **Clear display** of chosen policy in challenge rules

## 📊 Analytics

### Creator Dashboard
- **Total Tails**: 24h/7d/30d/all-time breakdowns
- **Unique Tailers**: Engagement metrics by time range
- **Conversion Rates**: Tails within window vs. total views
- **Top Sportsbooks/Leagues**: Performance by category
- **Bet Performance**: Individual slip analytics

### Member Stats
- **Personal Points**: Total earned in current challenge
- **Tail History**: Complete record with timestamps
- **Leaderboard Position**: Current rank and progress
- **Challenge Progress**: Points and ranking per challenge

## 🔒 Security & Anti-Abuse

### Validation Rules
- **IP tracking** for suspicious activity detection
- **User agent logging** for device fingerprinting
- **Rate limiting** on tail attempts
- **Unique constraints** prevent duplicate scoring

### Data Protection
- **Whop integration** for secure authentication
- **Environment variable** protection
- **Database connection** security
- **API endpoint** validation

## 🚀 Deployment

### Vercel Deployment
1. **Connect repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Configure database** connection
4. **Deploy** with automatic builds

### Database Setup
1. **Create PostgreSQL database**
2. **Run migrations** on deployment
3. **Configure connection pooling**
4. **Set up monitoring** and backups

## 🤝 Contributing

### Development Setup
1. **Fork the repository**
2. **Create feature branch**
3. **Install dependencies** with `pnpm install`
4. **Run development server** with `pnpm dev`
5. **Make changes** and test thoroughly
6. **Submit pull request** with clear description

### Code Standards
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Drizzle ORM** for database operations
- **Next.js 15** with App Router
- **Whop SDK** for platform integration

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Documentation
- **Whop Developer Docs**: https://dev.whop.com
- **Next.js Documentation**: https://nextjs.org/docs
- **Drizzle ORM Guide**: https://orm.drizzle.team

### Issues
- **GitHub Issues** for bug reports
- **Discussions** for feature requests
- **Discord** for community support

---

**Built with ❤️ for the Whop community**