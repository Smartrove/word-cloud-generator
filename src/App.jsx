import { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  text-align: center;
  margin: 20px;
`;

const Input = styled.input`
  padding: 5px;
  margin-right: 10px;
  width: 300px
  height: 50px;
  border: 1px solid #ccc;
  border-radius: 25px;

  &:focus{
    outline: 2px solid #e3651d;
    border: none;
  }
  
`;

const Button = styled.button`
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 25px;
  border: none;
  background-color: #e3651d;
  color: #fff;
`;

const Canvas = styled.canvas`
  border: 1px solid #e3651d;
  border-radius: 5px;
`;

const stopWords = [
  "the",
  "and",
  "is",
  "of",
  "in",
  "to",
  "a",
  "for",
  "with",
  "on",
  "at",
  "by",
  "about",
  "into",
  "through",
  "over",
  "after",
  "before",
  "under",
  "above",
  "below",
];

function App() {
  const [inputText, setInputText] = useState("");
  const [wordFrequencies, setWordFrequencies] = useState({});

  // Function to count word frequency
  function countWordFrequency(text) {
    text = text.toLowerCase();
    const words = text.match(/\b\w+\b/g);

    const filteredWords = words.filter((word) => !stopWords.includes(word));

    const wordCount = {};

    filteredWords.forEach((word) => {
      if (wordCount[word]) {
        wordCount[word] += 1;
      } else {
        wordCount[word] = 1;
      }
    });

    return wordCount;
  }

  useEffect(() => {
    const canvas = document.getElementById("wordFrequencyCanvas");
    const ctx = canvas.getContext("2d");

    ctx.lineWidth = 6;
    ctx.strokeStyle = "#333";
    ctx.beginPath();
    ctx.moveTo(256, 111);
    ctx.bezierCurveTo(358, 26, 446, 201, 273, 335);
    ctx.moveTo(256, 111);
    ctx.bezierCurveTo(137, 38, 99, 258, 273, 333);
    ctx.stroke();

    drawWordCloud(ctx, wordFrequencies);
  }, [wordFrequencies]);

  function drawWordCloud(ctx, wordFrequencies) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const words = Object.keys(wordFrequencies);
    const maxFrequency = Math.max(...Object.values(wordFrequencies));

    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;

    words.forEach((word, index) => {
      const fontSize = (wordFrequencies[word] / maxFrequency) * 40;

      let x = Math.random() * (canvasWidth - ctx.measureText(word).width);
      let y = Math.random() * (canvasHeight - fontSize);

      // Ensure the word fits within the canvas boundaries
      x = Math.max(5, x); // Add a left margin of 5 pixels
      y = Math.max(fontSize, y);

      // Generate a random color
      const color = getRandomColor();

      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = color;
      ctx.fillText(word, x, y);
    });
  }

  // Function to generate a random color
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleAddWord = () => {
    const updatedWordFrequencies = countWordFrequency(inputText);
    setWordFrequencies((prevWordFrequencies) => {
      const newFrequencies = { ...prevWordFrequencies };

      Object.keys(updatedWordFrequencies).forEach((word) => {
        newFrequencies[word] =
          (newFrequencies[word] || 0) + updatedWordFrequencies[word];
      });

      return newFrequencies;
    });
    setInputText("");
  };

  return (
    <Container>
      <h1 style={{ fontFamily: "Poppins", fontWeight: "500" }}>
        Word Cloud <span style={{ color: "#E3651D" }}>Generator</span>
      </h1>
      <Flex>
        <div>
          <Input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Enter a word......."
          />
          <Button onClick={handleAddWord}>Add Word to Cloud</Button>
        </div>
        <CanvasWrapper id="heart">
          <Canvas id="wordFrequencyCanvas" width="800" height="400"></Canvas>
        </CanvasWrapper>
      </Flex>
    </Container>
  );
}

export default App;

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  // max-width: 800px;
  width: 100%;
  justify-content: center;
`;

const CanvasWrapper = styled.div`
  margin-top: 1rem;
`;
