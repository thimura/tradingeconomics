# Compare countries
This is a Next.js project to compare two different countries on different indicators. 

All the data for this project is from the [Trading Economics API](https://docs.tradingeconomics.com). 

## Demo:
Watch the demo video below to see the application in action:

https://github.com/user-attachments/assets/a3e256f9-06c4-405e-adc8-331cf3f50dda


## Frontend:
- The frontend of the application is built using components from [shadcn/ui](https://ui.shadcn.com), along with other libraries for data visualization and theming.

## Backend features:
- **Caching**: Speeds up data retrieval by caching responses. This reduces the need to fetch the same data repeatedly.
- **Proxy**: Acts as an intermediary between the client and the external Trading Economics API to handle CORS issues and streamline data fetching.

## Installation and Setup
To get started with the project, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/your-repo/compare-countries.git
    cd compare-countries
    ```

2. Install the dependencies:

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

3. Create a `.env.local` file in the root directory and add your environment variables. For example:

    ```
    API_KEY=your_trading_economics_api_key
    ```

4. Run the development server:

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Packages Installed
The project uses the following packages:

```bash
npx shadcn-ui@latest init
npm install next-themes
npm install recharts@alpha
npm install radix-ui
npm install axios
npm install node-cache
