import { useEffect } from "react";
import { shortenUrl } from "./services/urlService";
import Homepage from "./pages/Homepage";

function App() {
  useEffect(() => {
    const test = async () => {
      try {
        const result = await shortenUrl("https://google.com");
        console.log("API works ! Response:", result);
      } catch (error) {
        console.error("API failed : ", error);
      }
    };

    test();
  }, []);

  return (
    <div>
      <Homepage />
    </div>
  );
}

export default App;
