import { useState, useEffect } from "react";
import personServices from "./services/persons";
import axios from "axios";
import "./App.css";

const Heading = ({ heading }) => {
  return (
    <table>
      <tbody>
        <tr>
          <th className="tableRow">{heading}</th>
        </tr>
      </tbody>
    </table>
  );
};

const Filter = ({ searchText, userSearchInput }) => {
  return (
    <>
      <Heading heading="Phonebook" />
      <table>
        <tbody>
          <tr>
            <th className="tableRow">Search</th>
            <td className="tableRow">
              <input className="inputField" value={searchText} onChange={userSearchInput} />
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

const PersonForm = ({
  userInputSubmit,
  newName,
  newNumber,
  userNameInput,
  userNumberInput,
  personAdded,
  inputLengthError,
  setInputLengthError,
}) => {
  return (
    <>
      <form onSubmit={userInputSubmit}>
        <div>
          <Heading heading="Add a new Contant" />
          <table>
            <tbody>
              {!personAdded && (
                <>
                  <tr>
                    <th className="tableRow">Name</th>
                    <td className="tableRow">
                      <input className="inputField" value={newName} onChange={userNameInput} />
                    </td>
                  </tr>
                  <tr>
                    <th className="tableRow">Number</th>
                    <td className="tableRow">
                      <input className="inputField" value={newNumber} onChange={userNumberInput} />
                    </td>
                  </tr>
                </>
              )}
              {personAdded && (
                <>
                  <tr>
                    <th style={{ color: "gray" }} className="tableRow">
                      Name
                    </th>
                    <td className="tableRow">
                      <input className="inputField" value={""} disabled />
                    </td>
                  </tr>
                  <tr>
                    <th style={{ color: "gray" }} className="tableRow">
                      Number
                    </th>
                    <td className="tableRow">
                      <input className="inputField" value={""} disabled />
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
        <div>
          <button className="addButton" type="submit">
            Add
          </button>
          {personAdded && (
            <table>
              <tbody>
                <tr>
                  <th className="tableRow">{`${newName} was Added XD`}</th>
                </tr>
              </tbody>
            </table>
          )}
          {inputLengthError.boolean && (
            <table>
              <tbody>
                <tr>
                  <th className="tableRow">{`${inputLengthError.errorMsg}`}</th>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </form>
    </>
  );
};

const Persons = ({ persons, searchText, deleteEntry, error, setError }) => {
  return (
    <>
      <Heading heading="Numbers" />
      <table>
        <tbody>
          <tr>
            <th style={{ textAlign: "left" }} className="tableRow">
              Name
            </th>
            <th style={{ textAlign: "left" }} className="tableRow">
              Number
            </th>
            <th style={{ textAlign: "left" }} className="tableRow">
              Action
            </th>
          </tr>
          {persons
            .filter((person) => person.name.toLowerCase().includes(searchText))
            .map((person) => (
              <tr key={person.id}>
                <td style={{ textAlign: "left" }} className="tableRow">
                  {person.name}
                </td>
                <td style={{ textAlign: "left" }} className="tableRow">
                  {person.number}
                </td>
                <td className="tableRow">
                  <button
                    className="deleteButton"
                    onClick={(e) => {
                      deleteEntry(e, person);
                    }}
                  >
                    ❌
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchText, setSearchText] = useState("");
  const [personAdded, setPersonAdded] = useState(false);
  const [error, setError] = useState({ boolean: false, name: "" });
  const [inputLengthError, setInputLengthError] = useState({ boolean: false, errorMsg: "" });

  const getPersonList = () => {
    personServices.getPersons().then((res) => setPersons(res));
  };

  useEffect(getPersonList, []);

  const userNameInput = (e) => {
    setNewName(e.target.value);
  };
  const userNumberInput = (e) => {
    setNewNumber(e.target.value);
  };
  const userSearchInput = (e) => {
    setSearchText(e.target.value);
  };

  const userInputSubmit = (e) => {
    e.preventDefault();
    let nameExists = false;
    const newPersonObject = {
      name: newName,
      number: newNumber,
    };

    persons.some((person) =>
      person.name == newPersonObject.name ? (nameExists = true) : (nameExists = false)
    );
    if (newPersonObject.name === "" || newPersonObject.number === "") {
      alert("You think im dumb? WRITE SOMETHING!!??!");
    } else if (!nameExists) {
      personServices
        .create(newPersonObject)
        .then((res) => {
          setPersons(persons.concat(res));
          setInputLengthError({ boolean: false, errorMsg: "" });
          setTimeout(() => {
            setPersonAdded(true);
            setTimeout(() => {
              setNewName("");
              setNewNumber("");
              setPersonAdded(false);
            }, 2000);
          }, 0);
        })
        .catch((error) => {
          console.log(error.response.data.message);
          setInputLengthError({ boolean: true, errorMsg: error.response.data.message });
        });
    } else {
      if (window.confirm(`Hey man, not cool, unless you wanna change youre phone number...?`)) {
        const url = "http://localhost:3001/api/persons/";
        const personCopy = persons.find((p) => p.name == newName);
        const changedNumber = { ...personCopy, number: newNumber };
        personServices.editEntry(personCopy.id, changedNumber).then((res) => getPersonList());
      }
    }
  };
  const deleteEntry = (e, person) => {
    e.preventDefault();
    if (window.confirm(`Are you sure you want to yeet ${person.name} off your contact list?`)) {
      personServices
        .deletion(person.id)
        .then((res) => getPersonList())
        .catch((e) => {
          if (e.response.status == 404) {
            console.log(person.name + " already yeeted yo");
            setError({ boolean: true, name: person.name });
            setTimeout(() => {
              setError({ boolean: false, name: "" });
              getPersonList();
            }, 3000);
          }
        });
    }
  };

  return (
    <div>
      {error.boolean && (
        <table>
          <tbody>
            <tr>
              <th className="tableRow">{`${error.name} doesn't exist man`}</th>
            </tr>
          </tbody>
        </table>
      )}
      <Filter searchText={searchText} userSearchInput={userSearchInput} />
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        userNameInput={userNameInput}
        userNumberInput={userNumberInput}
        userInputSubmit={userInputSubmit}
        personAdded={personAdded}
        inputLengthError={inputLengthError}
        setInputLengthError={setInputLengthError}
      />
      <Persons
        persons={persons}
        searchText={searchText}
        deleteEntry={deleteEntry}
        setError={setError}
        error={error}
      />
    </div>
  );
};
export default App;
