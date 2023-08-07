import "dotenv/config";
import { AppModule } from "./app/app.module";

(() => {
  new AppModule().init();
})();
