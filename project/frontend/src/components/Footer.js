import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import GitHubIcon from "@mui/icons-material/GitHub";
import "./Footer.css";

export const Footer = () => {
  return (
    <Navbar
      sticky="bottom"
      fixed="bottom"
      style={{
        background: "#2e3b55",
        minHeight: "33vh",
        position: "static",
        width: "100%",
        marginTop: "20px",
      }}
    >
      <Container>
        <div className="container">
          <div style={{ display: "flex"}}>
            <div className="footer-col-logo">
              <img src="https://mahidol.ac.th/documents/CI/update/Mahidol/1.png"></img>
            </div>
            {/* <div className="footer-col">
              <h4>Limitation of the program</h4>
              <ul>
                <li>
                  <a href="#">bag</a>
                </li>
                <li>
                  <a href="#">shoes</a>
                </li>
                <li>
                  <a href="#">dress</a>
                </li>
              </ul>
            </div> */}
            <div className="footer-col">
              <h4>follow us</h4>
              <div className="social-links">
                <a href="https://github.com/Chokchai213/web-modules" target="_blank">
                  <GitHubIcon />
                </a>
              </div>
            </div>
          </div>
          <div className="end-of-footer">
            <h5>Asset of Mahidol University, 2024</h5>
          </div>
        </div>
      </Container>
    </Navbar>
  );
};
