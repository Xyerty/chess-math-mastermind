
import { PlayFab, PlayFabClient, PlayFabServer } from 'playfab-sdk';

// Get PlayFab title ID from environment or fallback
const getPlayFabTitleId = () => {
  // In production, this should come from environment variables or Supabase secrets
  return "E7FCE"; // Your title ID
};

// Initialize PlayFab with title ID
export const initializePlayFab = () => {
  const titleId = getPlayFabTitleId();
  if (!titleId) {
    throw new Error('PlayFab Title ID not configured');
  }
  PlayFab.settings.titleId = titleId;
  console.log('PlayFab initialized with title ID:', titleId);
};

// PlayFab client operations (frontend)
export class PlayFabService {
  private static initialized = false;

  static initialize() {
    if (!this.initialized) {
      try {
        initializePlayFab();
        this.initialized = true;
        console.log('PlayFab service initialized successfully');
      } catch (error) {
        console.error('Failed to initialize PlayFab:', error);
        throw error;
      }
    }
  }

  // Login with custom ID (using Clerk user ID)
  static async loginWithCustomId(customId: string, createAccount: boolean = true) {
    this.initialize();
    
    return new Promise((resolve, reject) => {
      console.log('Attempting PlayFab login with custom ID:', customId);
      
      PlayFabClient.LoginWithCustomID({
        CustomId: customId,
        CreateAccount: createAccount
      }, (result, error) => {
        if (error) {
          console.error('PlayFab login error:', error);
          reject(new Error(`PlayFab login failed: ${error.errorMessage || 'Unknown error'}`));
        } else if (result) {
          console.log('PlayFab login successful:', result.data?.PlayFabId);
          resolve(result);
        } else {
          reject(new Error('PlayFab login failed: No result returned'));
        }
      });
    });
  }

  // Update player display name
  static async updateDisplayName(displayName: string) {
    return new Promise((resolve, reject) => {
      console.log('Updating PlayFab display name:', displayName);
      
      PlayFabClient.UpdateUserTitleDisplayName({
        DisplayName: displayName
      }, (result, error) => {
        if (error) {
          console.error('Failed to update display name:', error);
          reject(new Error(`Failed to update display name: ${error.errorMessage}`));
        } else {
          console.log('Display name updated successfully');
          resolve(result);
        }
      });
    });
  }

  // Submit player score to leaderboard
  static async submitScore(leaderboardName: string, score: number) {
    return new Promise((resolve, reject) => {
      console.log('Submitting score to leaderboard:', leaderboardName, score);
      
      PlayFabClient.UpdatePlayerStatistics({
        Statistics: [{
          StatisticName: leaderboardName,
          Value: score
        }]
      }, (result, error) => {
        if (error) {
          console.error('Failed to submit score:', error);
          reject(new Error(`Failed to submit score: ${error.errorMessage}`));
        } else {
          console.log('Score submitted successfully');
          resolve(result);
        }
      });
    });
  }

  // Get leaderboard
  static async getLeaderboard(leaderboardName: string, maxResults: number = 10) {
    return new Promise((resolve, reject) => {
      console.log('Fetching leaderboard:', leaderboardName);
      
      PlayFabClient.GetLeaderboard({
        StatisticName: leaderboardName,
        StartPosition: 0,
        MaxResultsCount: maxResults
      }, (result, error) => {
        if (error) {
          console.error('Failed to fetch leaderboard:', error);
          reject(new Error(`Failed to fetch leaderboard: ${error.errorMessage}`));
        } else if (result) {
          console.log('Leaderboard fetched successfully:', result.data?.Leaderboard?.length, 'entries');
          resolve(result);
        } else {
          reject(new Error('Failed to fetch leaderboard: No result returned'));
        }
      });
    });
  }

  // Send telemetry event
  static async sendEvent(eventName: string, eventData: any) {
    return new Promise((resolve, reject) => {
      console.log('Sending PlayFab event:', eventName, eventData);
      
      PlayFabClient.WritePlayerEvent({
        EventName: eventName,
        Body: eventData
      }, (result, error) => {
        if (error) {
          console.error('Failed to send event:', error);
          reject(new Error(`Failed to send event: ${error.errorMessage}`));
        } else {
          console.log('Event sent successfully');
          resolve(result);
        }
      });
    });
  }

  // Get player statistics
  static async getPlayerStatistics(statisticNames?: string[]) {
    return new Promise((resolve, reject) => {
      console.log('Fetching player statistics:', statisticNames);
      
      PlayFabClient.GetPlayerStatistics({
        StatisticNames: statisticNames
      }, (result, error) => {
        if (error) {
          console.error('Failed to fetch player statistics:', error);
          reject(new Error(`Failed to fetch player statistics: ${error.errorMessage}`));
        } else {
          console.log('Player statistics fetched successfully');
          resolve(result);
        }
      });
    });
  }

  // Check if PlayFab is initialized and connected
  static isInitialized(): boolean {
    return this.initialized && !!PlayFab.settings.titleId;
  }

  // Get connection status
  static getConnectionStatus(): { connected: boolean; titleId?: string } {
    return {
      connected: this.isInitialized(),
      titleId: PlayFab.settings.titleId
    };
  }
}
