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
        type,
        question,
        answer: type === 2 ? [a, b, c, d] : answer,
      },
    ]);

    e.target.reset();
  };

  React.useEffect(() => {
    setTest(JSON.parse(localStorage.getItem('test')) || []);
  }, []);

  React.useEffect(() => {
    if (test.length) localStorage.setItem('test', JSON.stringify(test));
  }, [test]);

  return (
    <div className="page">
      <form onSubmit={handleSubmit}>
        <div>
          <select
            name="type"
            onChange={(e) => setType(+e.target.value)}
            value={type}
          >
            <option value={0}>Short Answer</option>
            <option value={1}>Matching</option>
            <option value={2}>Multiple Choice</option>
          </select>
        </div>

        <div>
          <textarea name="question" placeholder="Question" />
        </div>

        {type === 1 && (
          <div>
            <textarea name="answer" placeholder="Answer" />
          </div>
        )}

        {type === 2 && (
          <div className="flex">
            <textarea name="a" placeholder="A" />
            <textarea name="b" placeholder="B" />
            <textarea name="c" placeholder="C" />
            <textarea name="d" placeholder="D" />
          </div>
        )}

        <button>Add</button>
      </form>

      <div>
        <h1>TEST</h1>

        <div className="flex space-between mb-3">
          <div>Name: _____________________________</div>
          <div>Date: ___________________</div>
        </div>
      </div>

      <div className="mb-2">
        <h3>SHORT ANSWER</h3>
        <p>Write the correct answer in the blank.</p>

        {test
          .filter((item) => item.type === 0)
          .map(({ question }, key) => (
            <div key={key} className="mb-1">
              {key + 1}. ________________________ {question}
            </div>
          ))}
      </div>

      <div className="mb-1">
        <h3>MATCHING</h3>
        <p>Match each description with the correct name.</p>

        <div className="flex">
          <div className="w-half-page mr-5">
            {test
              .filter((item) => item.type === 1)
              .map(({ question }, key) => (
                <div key={key} className="mb-1">
                  __________ {key + 1}. {question}
                </div>
              ))}
          </div>

          <div>
            {shuffle(test.filter((item) => item.type === 1)).map(
              ({ answer }, key) => (
                <div key={key} className="mb-1">
                  {alphabet[key]}. {answer}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <div>
        <h3>MULTIPLE CHOICE</h3>
        <p>Write the letter of the correct choice in the blank.</p>

        {test
          .filter((item) => item.type === 2)
          .map(({ question, answer }, key) => (
            <div key={key} className="mb-1">
              <div className="mb-1-2">
                __________ {key + 1}. {question}
              </div>
              <div className="flex">
                {answer.map((item, key) => (
                  <div key={key} className="mr-2">
                    {alphabet[key]}. {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
