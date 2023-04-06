import React from 'react';

export const Navbar = ({ newFile, openFile, saveFile, printFile }) => {
  return (
    <nav
      className="navbar navbar-expand bg-body-tertiary d-print-none"
      data-bs-theme="dark"
    >
      <div className="container-fluid">
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav">
            <li className="dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                File
              </a>

              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" onClick={newFile} href="#">
                    New
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" onClick={openFile} href="#">
                    Open
                  </a>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    onClick={(e) => saveFile(e, test)}
                    href="#"
                  >
                    Save
                  </a>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" onClick={printFile} href="#">
                    Print
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
