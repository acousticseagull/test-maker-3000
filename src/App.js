import React from 'react';
import './style.css';

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

const alphabet = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];

export default function App() {
  const [type, setType] = React.useState(0);

  const [test, setTest] = React.useState([]);

  const [file, setFile] = React.useState();

  const handleSubmit = (e) => {
    e.preventDefault();

    const { target } = e;
    const type = +target.type.value;
    const question = target.question.value;
    const answer = target.answer?.value;
    const a = target.a?.value;
    const b = target.b?.value;
    const c = target.c?.value;
    const d = target.d?.value;

    const newTest = [
      ...test,
      {
        key: Date.now(),
        type,
        question,
        answer: type === 2 ? [a, b, c, d] : answer,
      },
    ];

    setTest(newTest);

    saveFile(null, newTest);

    e.target.reset();
  };

  const newFile = (e) => {
    e.preventDefault();
    setTest([]);
    setFile(null);
  };

  async function saveFile(e, test) {
    e && e.preventDefault();

    const options = {
      types: [
        {
          description: 'Test',
          accept: {
            'text/plain': ['.json'],
          },
        },
      ],
    };

    const fileHandle = file ? file : await window.showSaveFilePicker(options);
    if (!file) setFile(fileHandle);
    const writableStream = await fileHandle.createWritable();
    await writableStream.write(JSON.stringify(test));
    await writableStream.close();
  }

  async function openFile(e) {
    e.preventDefault();

    const pickerOpts = {
      types: [
        {
          description: 'JSON',
          accept: {
            'application/json': ['.json'],
          },
        },
      ],
      excludeAcceptAllOption: true,
      multiple: false,
    };

    const [fileHandle] = await window.showOpenFilePicker(pickerOpts);

    setFile(fileHandle);

    const fileData = await fileHandle.getFile();
    const content = await fileData.text();

    setTest(JSON.parse(content));
  }

  const printFile = (e) => {
    e.preventDefault();
    print();
  };

  const removeQuestion = (e, key) => {
    e.preventDefault();
    const newTest = [...test.filter((item) => item.key !== key)];
    setTest(newTest);
    saveFile(null, newTest);
  };

  const shortAnswer = React.useMemo(
    () => test.filter(({ type }) => type === 0),
    [test]
  );

  const matching = React.useMemo(
    () => test.filter(({ type }) => type === 1),
    [test]
  );

  const multipleChoice = React.useMemo(
    () => shuffle(test.filter(({ type }) => type === 2)),
    [test]
  );

  return (
    <>
      <nav
        className="navbar navbar-expand-sm bg-body-tertiary d-print-none"
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

      <div className="p-3 mb-4 d-print-none shadow">
        <div className="">
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <select
                name="type"
                onChange={(e) => setType(+e.target.value)}
                value={type}
                className="form-select"
              >
                <option value={0}>Short Answer</option>
                <option value={1}>Matching</option>
                <option value={2}>Multiple Choice</option>
              </select>
            </div>

            <div className="row">
              <div className="col">
                <textarea
                  className="form-control"
                  name="question"
                  placeholder="Question"
                />
              </div>

              {type === 1 && (
                <div className="col">
                  <textarea
                    className="form-control"
                    name="answer"
                    placeholder="Answer"
                  />
                </div>
              )}
            </div>

            {type === 2 && (
              <div className="row mt-2">
                <div className="col">
                  <textarea className="form-control" name="a" placeholder="A" />
                </div>
                <div className="col">
                  <textarea className="form-control" name="b" placeholder="B" />
                </div>
                <div className="col">
                  <textarea className="form-control" name="c" placeholder="C" />
                </div>
                <div className="col">
                  <textarea className="form-control" name="d" placeholder="D" />
                </div>
              </div>
            )}

            <div class="d-grid gap-2">
              <button className="btn btn-primary mt-2">Add</button>
            </div>
          </form>
        </div>
      </div>

      <div className="container-md">
        <div className="mb-4 d-none d-print-block">
          <div className="row mb-3">
            <div className="col-6">Name: _____________________________</div>
            <div className="col-3">Date: ______________</div>
            <div className="col-3 text-end">Score: _______</div>
          </div>

          <div className="border-bottom border-3 border-black mb-3">
            <div className="fw-bold">QUIZ</div>
          </div>
        </div>

        {shortAnswer.length > 0 && (
          <div className="mb-4">
            <h5>
              SHORT ANSWER:{' '}
              <small className="text-body-secondary">
                Write the correct answer in the blank.
              </small>
            </h5>

            {shortAnswer.map(({ key, question }, index) => (
              <div key={key} className="mb-3">
                {index + 1}. ________________________ {question} (
                <a href="#" onClick={(e) => removeQuestion(e, key)}>
                  remove
                </a>
                )
              </div>
            ))}
          </div>
        )}

        {matching.length > 0 && (
          <div className="mb-2">
            <h5>
              MATCHING:{' '}
              <small className="text-body-secondary">
                Match each description with the correct name.
              </small>
            </h5>

            <div className="row">
              <div className="col-6 mr-3">
                {matching
                  .filter(({ question }) => question.length)
                  .map(({ key, question }, index) => (
                    <div key={key} className="mb-3">
                      __________ {index + 1}. {question} (
                      <a href="#" onClick={(e) => removeQuestion(e, key)}>
                        remove
                      </a>
                      )
                    </div>
                  ))}
              </div>

              <div className="col-6">
                {matching.map(({ key, answer }, index) => (
                  <div key={index} className="mb-3">
                    {alphabet[index]}. {answer}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {multipleChoice.length > 0 && (
          <div>
            <h5>
              MULTIPLE CHOICE:{' '}
              <small className="text-body-secondary">
                Write the letter of the correct choice in the blank.
              </small>
            </h5>

            {multipleChoice.map(({ key, question, answer }, index) => (
              <div key={key} className="mb-3">
                <div className="mb-1">
                  __________ {index + 1}. {question} (
                  <a href="#" onClick={(e) => removeQuestion(e, key)}>
                    remove
                  </a>
                  )
                </div>

                <div className="row mx-5">
                  <div className="col-6">a. {answer[0]}</div>
                  <div className="col-6">b. {answer[1]}</div>
                  <div className="col-6">c. {answer[2]}</div>
                  <div className="col-6">d. {answer[3]}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
