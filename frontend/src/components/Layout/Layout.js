import Header from "../Reusable/Header/Header";
import "./Layout.css";

const Layout = (props) => {
  return (
    <>
      <Header />
      <main>
        <div className="container">{props.children}</div>
      </main>
    </>
  );
};

export default Layout;
