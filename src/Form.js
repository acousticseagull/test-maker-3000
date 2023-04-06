import React from 'react';

export const Form = ({ handleSubmit, type, setType }) => {
  return (
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
  );
};
