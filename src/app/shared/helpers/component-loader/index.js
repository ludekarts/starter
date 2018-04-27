import Loadable from "react-loadable"
import Preloader from "./preloader"

// Component Loader.
export default (importCallback, preloader) =>
  Loadable({
    delay: 300,
    timeout: 10000,
    loader: importCallback,
    loading: preloader || Preloader
  });
