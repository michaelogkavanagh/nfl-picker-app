
// ===== Lambda Function 5: Get Season Leaderboard =====
// Function name: nfl-picker-leaderboard
// Description: Calculates and returns season-long leaderboard

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
    };
    
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }
    
    try {
        // Scan all items in the table
        const params = {
            TableName: 'nfl-picker'
        };
        
        const result = await dynamodb.scan(params).promise();
        
        // Organize data by week and type
        const weekData = {};
        result.Items.forEach(item => {
            const week = item.pk.replace('WEEK#', '');
            
            if (!weekData[week]) {
                weekData[week] = { picks: {}, results: {} };
            }
            
            if (item.type === 'PICKS') {
                const member = item.sk.replace('MEMBER#', '');
                weekData[week].picks[member] = item.picks;
            } else if (item.type === 'RESULTS') {
                weekData[week].results = item.results;
            }
        });
        
        // Calculate season scores
        const seasonScores = {};
        
        Object.entries(weekData).forEach(([week, data]) => {
            const { picks, results } = data;
            
            Object.entries(picks).forEach(([member, memberPicks]) => {
                if (!seasonScores[member]) {
                    seasonScores[member] = { correct: 0, total: 0 };
                }
                
                Object.entries(memberPicks).forEach(([gameId, pick]) => {
                    seasonScores[member].total++;
                    if (results[gameId] && results[gameId] === pick) {
                        seasonScores[member].correct++;
                    }
                });
            });
        });
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                leaderboard: seasonScores
            })
        };
        
    } catch (error) {
        console.error('Error getting leaderboard:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Internal server error'
            })
        };
    }
};