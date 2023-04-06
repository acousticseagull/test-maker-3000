import React from 'react';
import './style.css';

import { Navbar } from './Navbar';
import { Form } from './Form';

function sortAndOrderQuestions(test) {
  return [...test]
    .sort((a, b) => {
      if (a.type < b.type) return -1;
      if (a.type > b.type) return 1;
      return 0;
    })
    .map((item, index) => ({ ...item, number: index + 1 }));
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

  const count = React.useRef(0);

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

    const newTest = sortAndOrderQuestions([
      ...test,
      {
        key: Date.now(),
        type,
        question,
        answer: type === 2 ? [a, b, c, d] : answer,
      },
    ]);

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
    const newTest = sortAndOrderQuestions([
      ...test.filter((item) => item.key !== key),
    ]);
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
    () => test.filter(({ type }) => type === 2),
    [test]
  );

  return (
    <>
      <Navbar
        newFile={newFile}
        saveFile={saveFile}
        openFile={openFile}
        printFile={printFile}
      />

      <Form handleSubmit={handleSubmit} type={type} setType={setType} />

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

            {shortAnswer.map(({ key, question, number }, index) => (
              <div key={key} className="mb-3 row">
                <div className="col-auto">
                  {number}. ________________________
                </div>
                <div className="col">
                  {question}{' '}
                  <span className="d-print-none">
                    (
                    <a href="#" onClick={(e) => removeQuestion(e, key)}>
                      remove
                    </a>
                    )
                  </span>
                </div>
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
              <div className="col-6">
                {matching.map(({ key, question, number }) => (
                  <div key={key} className="row mb-3">
                    <div className="col-auto">__________ {number}.</div>
                    <div className="col">
                      {question}{' '}
                      <span className="d-print-none">
                        (
                        <a href="#" onClick={(e) => removeQuestion(e, key)}>
                          remove
                        </a>
                        )
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="col-5 offset-1">
                {matching.map(({ key, answer }, index) => (
                  <div key={key} className="mb-3">
                    {alphabet[index]}. {answer}{' '}
                    <span className="d-print-none">
                      (
                      <a href="#" onClick={(e) => removeQuestion(e, key)}>
                        remove
                      </a>
                      )
                    </span>
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

            {multipleChoice.map(({ key, question, answer, number }) => (
              <div key={key} className="mb-3">
                <div className="mb-1 row">
                  <div className="col-auto">__________ {number}.</div>
                  <div className="col">
                    {question}{' '}
                    <span className="d-print-none">
                      (
                      <a href="#" onClick={(e) => removeQuestion(e, key)}>
                        remove
                      </a>
                      )
                    </span>
                  </div>
                </div>

                <div className="row">
                  <div className="col-6">a. {answer[0]}</div>
                  <div className="col-6">c. {answer[1]}</div>
                  <div className="col-6">b. {answer[2]}</div>
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
