## Creating a `.env` File

To configure your Twitch Username Color Changer, you need a `.env` file in your project directory. This file stores environment variables required by the application.

### Steps:

1. **Create the `.env` file**  
    In the root of your project, create a file named `.env` (no filename, just `.env` as the extension).

2. **Add the following content:**  
    Copy and paste the following template into your `.env` file:

    ```env
    TWITCH_CLIENT_ID=your_twitch_client_id
    TWITCH_USERNAME=your_twitch_username
    TWITCH_TOKEN=your_twitch_access_token
    TWITCH_CHANNELS=
    COLORS=
    ```

3. **Replace the placeholder values:**  
    - `TWITCH_CLIENT_ID`: Your Twitch application's client ID.
    - `TWITCH_USERNAME`: Your Twitch username.
    - `TWITCH_TOKEN`: Your Twitch access token (format: `xxxxxxxxxxxxxxxxxxxxxx`, without `oauth:`).
    - `TWITCH_CHANNELS`: Comma-separated list of channels to join (e.g., `example_channel1,example_channel2`).
    - `COLORS`: (Optional) Comma-separated list of colors in hex format (e.g., `#ff0000,#00ff00,#0000ff`). If not set, the app will use a default set of colors.

4. **Save the file.**

**Note:** Never commit your `.env` file to public repositories, as it contains sensitive information.

## Running the Application

After setting up your `.env` file, you can start the Twitch Username Color Changer:

1. **Install dependencies:**  
    Run the following command in your project directory:
    ```bash
    npm install
    ```

2. **Start the application:**  
    Use the command:
    ```bash
    npm start
    ```

The app will connect to the specified Twitch channels and begin changing username colors as configured.