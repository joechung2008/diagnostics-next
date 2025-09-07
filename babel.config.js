module.exports = {
  presets: ["next/babel"],
  plugins: [
    [
      "babel-plugin-react-compiler",
      {
        target: "18", // React 18 support
      },
    ],
  ],
};
