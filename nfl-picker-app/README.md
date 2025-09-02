# 🏈 NFL Game Winner Picker App

A serverless web application for running weekly NFL pick'em games with your friends. Built with vanilla JavaScript frontend and AWS serverless backend.

![NFL Picker App](https://img.shields.io/badge/NFL-Picker%20App-blue?style=for-the-badge&logo=amazonaws)
![Free Tier](https://img.shields.io/badge/AWS-Free%20Tier-green?style=for-the-badge)
![No Database](https://img.shields.io/badge/Serverless-DynamoDB-orange?style=for-the-badge)

## ✨ Features

### 🎯 Core Functionality
- **Weekly Pick Management**: Select winners for each NFL game
- **Real-time Collaboration**: All friends use the same shared data
- **Automatic Scoring**: Track correct/incorrect picks automatically
- **Season Leaderboard**: View cumulative stats across all weeks
- **Mobile Responsive**: Works perfectly on phones and tablets

### 🚀 Technical Features
- **100% Serverless**: No servers to manage or maintain
- **AWS Free Tier**: Runs completely free for typical usage
- **Real-time Updates**: See picks and results instantly
- **Offline Capable**: Works without internet for viewing
- **No Authentication Required**: Simple name-based participation

## 🏗️ Architecture

```
Frontend (HTML/JS) → API Gateway → Lambda Functions → DynamoDB
                                      ↓
                              CloudWatch Logs (monitoring)
```

### AWS Services Used
- **DynamoDB**: Data storage for picks and results
- **Lambda**: Serverless backend functions (5 total)
- **API Gateway**: RESTful API endpoints
- **S3** (optional): Static website hosting
- **CloudWatch**: Logging and monitoring

## 📋 Prerequisites

- AWS Account (free tier eligible)
- Basic familiarity with AWS Console
- Text editor for configuration
- Modern web browser

### Optional Tools
- AWS CLI (for command-line deployment)
- Git (for version control)
- VS Code (recommended editor)

## 🚀 Quick Start

### 1. Deploy Backend Infrastructure

```bash
# Clone this repository
git clone https://github.com/yourusername/nfl-picker-app.git
cd nfl-picker-app

# Follow the detailed deployment guide
# See DEPLOYMENT.md for step-by-step instructions
```

### 2. Configure Frontend

1. Open `index.html` in a web browser
2. Go to "AWS Configuration" section
3. Enter your API Gateway endpoint URL
4. Click "Save Configuration"

### 3. Start Playing!

1. Select a week and load games
2. Enter your name and make picks
3. Share the app with friends
4. Update results after games complete
5. View leaderboards and season stats

## 📁 Project Structure

```
nfl-picker-app/
│
├── 📄 index.html                 # Main application file
├── 📄 README.md                  # This file
├── 📄 DEPLOYMENT.md              # Detailed AWS setup guide
│
├── 📁 lambda-functions/          # AWS Lambda backend code
│   ├── save-picks.js            # Save user picks
│   ├── get-picks.js             # Retrieve picks for a week
│   ├── save-results.js          # Save game results
│   ├── get-results.js           # Get results for a week
│   └── leaderboard.js           # Calculate season standings
│
├── 📁 docs/                     # Documentation
│   ├── api-reference.md         # API endpoint documentation
│   ├── troubleshooting.md       # Common issues and solutions
│   └── security.md              # Security considerations
│
└── 📁 examples/                 # Example configurations
    ├── sample-picks.json        # Example picks data
    ├── sample-results.json      # Example results data
    └── dynamodb-schema.json     # DynamoDB table structure
```

## 🔧 Configuration

### Environment Variables (Lambda)
```javascript
// No environment variables required
// All configuration is handled through DynamoDB table name
const TABLE_NAME = 'nfl-picker';
```

### Frontend Configuration
```javascript
// Set your API endpoint in the app
const API_ENDPOINT = 'https://your-api-id.execute-api.region.amazonaws.com/prod';
```

## 📊 Data Model

### DynamoDB Schema
```
Table: nfl-picker
Partition Key: pk (String)
Sort Key: sk (String)

Data Structure:
- Picks: pk="WEEK#1", sk="MEMBER#John", picks={game1: "Patriots", ...}
- Results: pk="WEEK#1", sk="RESULTS", results={game1: "Patriots", ...}
```

### Sample Data
```json
{
  "pk": "WEEK#1",
  "sk": "MEMBER#John",
  "picks": {
    "game_1": "Patriots",
    "game_2": "Chiefs",
    "game_3": "Cowboys"
  },
  "timestamp": "2024-09-08T20:00:00.000Z",
  "type": "PICKS"
}
```

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/picks` | Save user picks for a week |
| `GET` | `/picks/{week}` | Get all picks for a week |
| `POST` | `/results` | Save game results |
| `GET` | `/results/{week}` | Get results for a week |
| `GET` | `/leaderboard` | Get season leaderboard |

### Example API Calls

```javascript
// Save picks
POST /picks
{
  "week": "Week 1",
  "member": "John",
  "picks": {
    "game_1": "Patriots",
    "game_2": "Chiefs"
  }
}

// Get picks
GET /picks/Week%201
// Returns: { success: true, picks: {...} }
```

## 🎮 Usage Guide

### For League Commissioners

1. **Setup**: Deploy AWS infrastructure and configure app
2. **Weekly Process**:
   - Share app link with participants
   - Set deadline for picks submission
   - Update game results after completion
   - Share leaderboard updates

3. **Season Management**:
   - Monitor participation
   - Export data if needed
   - Manage any disputes

### For Participants

1. **Making Picks**:
   - Open app and enter your name
   - Select the week
   - Click on your predicted winner for each game
   - Save your picks before the deadline

2. **Viewing Results**:
   - Check "View Picks" tab to see everyone's selections
   - Check "Results" tab for scores and standings
   - Monitor season leaderboard in "Manage" tab

## 💰 Cost Breakdown

### AWS Free Tier (12 months)
- **DynamoDB**: 25 GB storage, 25 RCU/WCU
- **Lambda**: 1M requests/month, 400k GB-seconds
- **API Gateway**: 1M requests/month
- **S3**: 5 GB storage, 15 GB data transfer

### Estimated Usage (10 friends, 18 weeks)
- **Database Operations**: ~5,000 requests/season
- **Lambda Invocations**: ~10,000/season
- **Data Storage**: <1 MB total
- **API Calls**: ~2,000/season

**Result**: $0/month within free tier limits! 💰

## 🔧 Customization

### Adding New Features

1. **Custom Scoring**: Modify Lambda functions for different point systems
2. **Email Notifications**: Add SES integration for reminders
3. **Advanced Stats**: Extend DynamoDB schema for detailed analytics
4. **Team Branding**: Customize CSS and add team logos
5. **Mobile App**: Use AWS Amplify for native mobile versions

### Modifying Game Data

Currently uses sample data. To integrate real NFL schedules:

```javascript
// Replace generateSampleGames() function
async function loadRealGames(week) {
  // Integrate with ESPN API, NFL API, or similar
  const response = await fetch(`https://api.example.com/nfl/week/${week}`);
  return await response.json();
}
```

## 🛡️ Security Considerations

### Current Security Level: Basic
- Public API endpoints
- No user authentication
- Basic input validation

### Production Recommendations
1. **Add Authentication**: AWS Cognito integration
2. **API Keys**: Protect endpoints with API Gateway keys
3. **Input Validation**: Enhance Lambda function validation
4. **Rate Limiting**: Add throttling to prevent abuse
5. **HTTPS Only**: Ensure secure connections
6. **CORS Restrictions**: Limit to your domain only

### Minimal Security Setup
```javascript
// Add to Lambda functions
const allowedOrigins = ['https://yourdomain.com'];
const origin = event.headers.origin;

if (!allowedOrigins.includes(origin)) {
  return { statusCode: 403, body: 'Forbidden' };
}
```

## 📈 Monitoring & Analytics

### CloudWatch Metrics
- Lambda function invocations
- API Gateway request counts
- DynamoDB read/write capacity
- Error rates and latency

### Custom Logging
```javascript
// Add to Lambda functions
console.log(`User: ${member}, Week: ${week}, Picks: ${Object.keys(picks).length}`);
```

### Performance Monitoring
- Average response times
- Peak usage periods
- Error frequency
- User participation rates

## 🚨 Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| CORS errors | Missing CORS headers | Enable CORS in API Gateway |
| 403 Forbidden | IAM permissions | Check Lambda execution role |
| Data not saving | DynamoDB access | Verify table name and permissions |
| API not found | Incorrect endpoint | Double-check API Gateway URL |

### Debug Steps
1. Check browser console for errors
2. Verify API endpoint configuration
3. Test Lambda functions individually
4. Check CloudWatch logs
5. Validate DynamoDB table structure

### Getting Help
- Check `docs/troubleshooting.md` for detailed solutions
- Review CloudWatch logs for error details
- Test API endpoints with Postman
- Verify AWS service configurations

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Make changes and test locally
4. Update documentation if needed
5. Submit pull request

### Code Standards
- Use ES6+ JavaScript features
- Add error handling to all async operations
- Include JSDoc comments for functions
- Follow AWS Lambda best practices
- Test all API endpoints

### Feature Requests
- Open GitHub issue with detailed description
- Include use case and expected behavior
- Consider backward compatibility
- Provide mockups for UI changes

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

Free to use, modify, and distribute for personal and commercial use.

## 🙏 Acknowledgments

- Built with AWS serverless technologies
- Inspired by fantasy football and office pool games
- Community feedback and contributions
- AWS Free Tier making this affordable for everyone

## 🔗 Links & Resources

### Documentation
- [AWS Lambda Developer Guide](https://docs.aws.amazon.com/lambda/)
- [DynamoDB Developer Guide](https://docs.aws.amazon.com/dynamodb/)
- [API Gateway Developer Guide](https://docs.aws.amazon.com/apigateway/)

### NFL Data Sources
- [ESPN API](http://www.espn.com/apis/devcenter/overview.html)
- [NFL.com](https://www.nfl.com)
- [Pro Football Reference](https://www.pro-football-reference.com/)

### Related Projects
- Fantasy football apps
- March Madness bracket games
- Office pool management tools

---

## 📞 Support

Need help? Check these resources:

1. **Documentation**: Read `DEPLOYMENT.md` for setup help
2. **Issues**: Create GitHub issue for bugs
3. **Discussions**: Use GitHub Discussions for questions
4. **AWS Support**: AWS Free Tier includes basic support

---

**Made with ❤️ for NFL fans everywhere!**

*Remember: This is for entertainment purposes. Please gamble responsibly and follow your local laws.*