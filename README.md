
# 👑 Chess & Math: The Ultimate Brain Workout 👑

Welcome to Chess & Math, where strategy meets calculation! 🧠 This isn't just a game; it's a fun and engaging way to sharpen your mind. Challenge yourself with a unique blend of classic chess and stimulating math problems.

## 🎮 How to Play

1.  **Start a Game**: Navigate to the "Play Game" section from the main menu.
2.  **Select a Piece**: Click on one of your pieces to move it.
3.  **Solve the Math Challenge**: Before you can move, a math problem will appear. Solve it correctly to proceed!
4.  **Make Your Move**: After solving the problem, click on a valid square to move your piece.
5.  **Checkmate!**: Outsmart your opponent on the board and with your math skills to win the game.

## ✨ Features

-   **Responsive Design**: Play seamlessly on your desktop, tablet, or mobile phone. 📱
-   **Interactive Gameplay**: A dynamic experience that combines two classic brain exercises.
-   **Multiple Languages**: Available in English and Spanish. 🌍
-   **Game Statistics**: Track your progress and see how you improve over time (coming soon!).
-   **Customizable Settings**: Adjust the game to your liking.

## 💻 Supported Platforms 🖥️📱

You can enjoy Chess & Math on a variety of platforms:

*   **Desktop 🖥️**:
    *   Windows
    *   macOS
    *   Linux
*   **Web Browsers 🌐**:
    *   Chrome
    *   Firefox
    *   Safari
    *   Edge
*   **Mobile 📱**:
    *   Android (Full experience via Termux, or play in browser)
    *   iOS (Play in browser)

## 💡 Technologies Used

This project is built with a modern, powerful stack:

-   **Vite**: Blazing fast frontend tooling.
-   **React**: A JavaScript library for building user interfaces.
-   **TypeScript**: Strong typing for robust and maintainable code.
-   **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
-   **shadcn/ui**: Beautifully designed, accessible components.
-   **pnpm**: Fast, disk space-efficient package manager.

## 🛠️ Get Started Locally

Note: For desktop users (Windows, macOS, Linux), ensure you have Node.js and pnpm installed. You can download Node.js from [https://nodejs.org/](https://nodejs.org/) and pnpm from [https://pnpm.io/installation](https://pnpm.io/installation).

Want to run the project on your own machine? Follow these simple steps:

```sh
# 1. Clone the repository
git clone <YOUR_GIT_URL>

# 2. Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# 3. Install dependencies
pnpm install

# 4. Start the development server
pnpm dev
```

Now you're all set to play and contribute! 🎉

### Specific Steps for Termux (Android)

If you're using Termux on Android, follow these steps first:

```sh
# 1. Update and upgrade Termux packages
pkg update && pkg upgrade

# 2. Install necessary tools: git, Node.js, and pnpm
pkg install git nodejs pnpm
# If pnpm isn't available directly via pkg, you might need to install it via npm:
# npm install -g pnpm
```
After these steps, you can proceed with the standard repository cloning and setup instructions mentioned above.

## 🛡️ Security Scanning with Snyk

This project uses [Snyk](https://snyk.io/) to continuously find and fix vulnerabilities. To run a security scan locally, follow these steps after installing the dependencies:

```sh
# 1. Authenticate with your Snyk account (first time only)
pnpm snyk auth

# 2. Test your project for vulnerabilities
pnpm snyk test

# 3. Monitor your project to get notified about new vulnerabilities
pnpm snyk monitor
```

## 📈 Performance Auditing with Lighthouse

This project uses [Lighthouse](https://developer.chrome.com/docs/lighthouse/) to audit performance, accessibility, and SEO. To run an audit locally, first make sure the development server is running (`pnpm dev`), then execute the following command in a separate terminal:

```sh
# Create a reports directory and run the audit
pnpm lighthouse http://localhost:8080 --output html --output-path ./reports/lighthouse.html --view
```

This will generate an HTML report and automatically open it in your browser.
