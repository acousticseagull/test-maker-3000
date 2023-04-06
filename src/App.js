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

    setTest((state) => [
      ...state,
      {
        key: Date.now(),
        type,
        question,
        answer: type === 2 ? [a, b, c, d] : answer,
      },
    ]);

    e.target.reset();
  };

  const newTest = (e) => {
    e.preventDefault();
    setTest([]);
  };

  async function saveFile(e) {
    // create a new handle
    const newHandle = await window.showSaveFilePicker();

    // create a FileSystemWritableFileStream to write to
    const writableStream = await newHandle.createWritable();

    // write our file
    await writableStream.write(JSON.stringify(test));

    // close the file and write the contents to disk.
    await writableStream.close();
  }

  async function openFile(e) {
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

    // Open file picker and destructure the result the first handle
    const [fileHandle] = await window.showOpenFilePicker(pickerOpts);

    // get file contents
    const fileData = await fileHandle.getFile();

    const content = await fileData.text();

    setTest(JSON.parse(content));
  }

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

  React.useEffect(() => {
    //setTest(JSON.parse(localStorage.getItem('test')) || []);
  }, []);

  React.useEffect(() => {
    //if (test.length) localStorage.setItem('test', JSON.stringify(test));
  }, [test]);

  return (
    <>
      <nav
        className="navbar sticky-top bg-primary bg-body-tertiary d-print-none"
        data-bs-theme="dark"
      >
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">Test Maker 3000</span>

          <div>
            <button class="btn" onClick={newTest}>
              New Test
            </button>

            <button class="btn" onClick={openFile}>
              Open Test
            </button>

            <button class="btn" onClick={saveFile}>
              Save Test
            </button>
          </div>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="card my-3 d-print-none">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <select
                  name="type"
                  onChange={(e) => setType(+e.target.value)}
                  value={type}
                  className="form-control"
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
                    <textarea
                      className="form-control"
                      name="a"
                      placeholder="A"
                    />
                  </div>
                  <div className="col">
                    <textarea
                      className="form-control"
                      name="b"
                      placeholder="B"
                    />
                  </div>
                  <div className="col">
                    <textarea
                      className="form-control"
                      name="c"
                      placeholder="C"
                    />
                  </div>
                  <div className="col">
                    <textarea
                      className="form-control"
                      name="d"
                      placeholder="D"
                    />
                  </div>
                </div>
              )}

              <div className="row">
                <div className="col">
                  <button className="btn btn-primary mt-2">Add</button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="mb-4">
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
                {index + 1}. ________________________ {question}
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
                      __________ {index + 1}. {question}
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
                  __________ {index + 1}. {question}
                </div>

                <div className="row mx-5">
                  {answer.map((item, key) => (
                    <div key={key} className="col-6">
                      {alphabet[index]}. {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
