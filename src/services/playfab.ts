
import { PlayFab, PlayFabClient, PlayFabServer } from 'playfab-sdk';

// Initialize PlayFab with title ID
export const initializePlayFab = () => {
  PlayFab.settings.titleId = "E7FCE"; // Using the title ID from your secrets
};

// PlayFab client operations (frontend)
export class PlayFabService {
  private static initialized = false;

  static initialize() {
    if (!this.initialized) {
      initializePlayFab();
      this.initialized = true;
    }
  }

  // Login with custom ID (using Clerk user ID)
  static async loginWithCustomId(customId: string, createAccount: boolean = true) {
    this.initialize();
    
    return new Promise((resolve, reject) => {
      PlayFabClient.LoginWithCustomID({
        CustomId: customId,
        CreateAccount: createAccount
      }, (result, error) => {
        if (error) {
          console.error('PlayFab login error:', error);
          reject(error);
        } else {
          console.log('PlayFab login successful:', result);
          resolve(result);
        }
      });
    });
  }

  // Update player display name
  static async updateDisplayName(displayName: string) {
    return new Promise((resolve, reject) => {
      PlayFabClient.UpdateUserTitleDisplayName({
        DisplayName: displayName
      }, (result, error) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  // Submit player score to leaderboard
  static async submitScore(leaderboardName: string, score: number) {
    return new Promise((resolve, reject) => {
      PlayFabClient.UpdatePlayerStatistics({
        Statistics: [{
          StatisticName: leaderboardName,
          Value: score
        }]
      }, (result, error) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  // Get leaderboard
  static async getLeaderboard(leaderboardName: string, maxResults: number = 10) {
    return new Promise((resolve, reject) => {
      PlayFabClient.GetLeaderboard({
        StatisticName: leaderboardName,
        StartPosition: 0,
        MaxResultsCount: maxResults
      }, (result, error) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  // Send telemetry event
  static async sendEvent(eventName: string, eventData: any) {
    return new Promise((resolve, reject) => {
      PlayFabClient.WritePlayerEvent({
        EventName: eventName,
        Body: eventData
      }, (result, error) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  // Get player statistics
  static async getPlayerStatistics(statisticNames?: string[]) {
    return new Promise((resolve, reject) => {
      PlayFabClient.GetPlayerStatistics({
        StatisticNames: statisticNames
      }, (result, error) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }
}
