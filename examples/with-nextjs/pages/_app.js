import { useRouter } from 'next/router';

import GlobalStyles from '../styled/global';
import '../styled/fonts/index.css';

const App = ({ Component, pageProps: { pageProps }, }) => {
	const router = useRouter();

	return (
	  <>
		  <GlobalStyles />
			<Component key={router.asPath} {...pageProps} />
		</>
	)
};

export default App;