// ===== Lambda Function 1: Save Picks =====
// Function name: nfl-picker-save-picks
// Description: Saves user picks to DynamoDB

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    // Enable CORS
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
        const body = JSON.parse(event.body);
        const { week, member, picks, timestamp } = body;
        
        if (!week || !member || !picks) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Missing required fields: week, member, picks'
                })
            };
        }
        
        // Save picks to DynamoDB
        const params = {
            TableName: 'nfl-picker',
            Item: {
                pk: `WEEK#${week}`,
                sk: `MEMBER#${member}`,
                picks: picks,
                timestamp: timestamp,
                type: 'PICKS'
            }
        };
        
        await dynamodb.put(params).promise();
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Picks saved successfully'
            })
        };
        
    } catch (error) {
        console.error('Error saving picks:', error);
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

// ===== Lambda Function 2: Get Picks =====
// Function name: nfl-picker-get-picks
// Description: Retrieves picks for a specific week

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
        const week = decodeURIComponent(event.pathParameters.week);
        
        // Query all picks for the week
        const params = {
            TableName: 'nfl-picker',
            KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
            ExpressionAttributeValues: {
                ':pk': `WEEK#${week}`,
                ':sk': 'MEMBER#'
            }
        };
        
        const result = await dynamodb.query(params).promise();
        
        // Transform data into expected format
        const picks = {};
        result.Items.forEach(item => {
            const member = item.sk.replace('MEMBER#', '');
            picks[member] = {
                picks: item.picks,
                timestamp: item.timestamp
            };
        });
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                picks: picks
            })
        };
        
    } catch (error) {
        console.error('Error getting picks:', error);
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

// ===== Lambda Function 3: Save Results =====
// Function name: nfl-picker-save-results
// Description: Saves game results to DynamoDB

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
        const body = JSON.parse(event.body);
        const { week, results, timestamp } = body;
        
        if (!week || !results) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Missing required fields: week, results'
                })
            };
        }
        
        // Save results to DynamoDB
        const params = {
            TableName: 'nfl-picker',
            Item: {
                pk: `WEEK#${week}`,
                sk: 'RESULTS',
                results: results,
                timestamp: timestamp,
                type: 'RESULTS'
            }
        };
        
        await dynamodb.put(params).promise();
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Results saved successfully'
            })
        };
        
    } catch (error) {
        console.error('Error saving results:', error);
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

// ===== Lambda Function 4: Get Results =====
// Function name: nfl-picker-get-results
// Description: Retrieves results for a specific week

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
        const week = decodeURIComponent(event.pathParameters.week);
        
        // Get results for the week
        const params = {
            TableName: 'nfl-picker',
            Key: {
                pk: `WEEK#${week}`,
                sk: 'RESULTS'
            }
        };
        
        const result = await dynamodb.get(params).promise();
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                results: result.Item?.results || {}
            })
        };
        
    } catch (error) {
        console.error('Error getting results:', error);
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