// external import
import type { AppProps } from 'next/app'
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

// internal imports
import MusterLayout from '../components/layouts/MusterLayout'
import '/sass/style.scss';
import '/public/static/css/bootstrap.min.css';
import {store} from '../app/store'

let persistor = persistStore(store);

function MyApp({ Component, pageProps }: AppProps) {
  return (
  <Provider store={store}>
       <PersistGate loading={null} persistor={persistor}>
            <MusterLayout>
            <Component {...pageProps} />
            </MusterLayout>
       </PersistGate>
  </Provider>

  )
}

export default MyApp