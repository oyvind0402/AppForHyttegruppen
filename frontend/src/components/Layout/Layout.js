import Footer from '../01-Reusable/Footer/Footer';
import Header from '../01-Reusable/Header/Header';
import './Layout.css';

const Layout = (props) => {
  return (
    <>
      <Header />
      <main>
        <div className="container" id="container">
          {props.children}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Layout;
