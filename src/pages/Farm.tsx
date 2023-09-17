import { constants } from "../components/constants";
import { ethers, Contract, utils } from "ethers";
import Nest from "../abi/Nest.json";
import { useEffect, useState } from "react";

interface FarmProps {
  account: string;
  setAccount: (account: string) => void;
}

export const Farm = ({ account, setAccount }: FarmProps) => {
  // Bird hooks
  const [birdId, setBirdId] = useState(0);
  const [birdNumber, setBirdNumber] = useState(0);
  const [birdName, setBirdName] = useState("");
  const [birdExp, setBirdExp] = useState(0);
  const [birdLevel, setBirdLevel] = useState(0);
  const [birdAd, setBirdAd] = useState(0);

  // Plant hooks
  const [plantId, setPlantId] = useState(0);
  const [plantHp, setPlantHp] = useState(0);
  const [plantExpReward, setPlantExpReward] = useState(0);
  const [plantDeadTime, setPlantDeadTime] = useState(0);
  const [plantClass, setPlantClass] = useState(0);

  const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
  const provider = new ethers.providers.JsonRpcProvider(constants.baobabRpcUrl);
  let nest = new ethers.Contract(constants.nestAddress, Nest, provider);
  nest = nest.connect(signer);

  const createBird = async () => {
    const tx = await nest.createBird("birdie", {
      value: utils.parseEther("0.01"),
    });
    await tx.wait();
    updateBird();
  };

  const createPlant = async () => {
    const tx = await nest.createPlant(0);
    await tx.wait();
    updatePlant();
  };

  const feedPlant = async () => {
    const plantInfo = await nest.retrievePlantInfo();
    const plantHp = plantInfo[1].toNumber();
    if (plantHp == 0) {
      alert("Plant is dead!");
      return;
    }

    const tx = await nest.feedPlant(birdId, plantId);
    await tx.wait();
    updateBird();
  };

  const revivePlant = async () => {
    const plantInfo = await nest.retrievePlantInfo();
    const plantDeadTime = plantInfo[3].toNumber();
    const blockTimestamp = (await provider.getBlock("latest")).timestamp;
    console.log(blockTimestamp, plantDeadTime);

    if (blockTimestamp - plantDeadTime < 10) {
      alert("Needs respawn time!");
      return;
    }

    const tx = await nest.revivePlant(plantId);
    await tx.wait();
    updatePlant();
  };

  const levelUp = async () => {
    const tx = await nest.levelUp(birdId);
    await tx.wait();
    updateBird();
  };

  const updateBird = async () => {
    const birdInfoTemp = await nest.retrieveBirdInfo();
    setBirdId(birdInfoTemp[0]?.toNumber());
    setBirdName(birdInfoTemp[1]?.toString());
    setBirdAd(birdInfoTemp[2]?.toNumber());
    setBirdExp(birdInfoTemp[3]?.toNumber());
    setBirdLevel(birdInfoTemp[4]?.toNumber());
    setBirdNumber(birdInfoTemp[5]?.toNumber());
  };

  const updatePlant = async () => {
    const plantInfoTemp = await nest.retrievePlantInfo();
    setPlantId(plantInfoTemp[0].toNumber());
    setPlantHp(plantInfoTemp[1]?.toNumber());
    setPlantExpReward(plantInfoTemp[2]?.toNumber());
    setPlantDeadTime(plantInfoTemp[3]?.toNumber());
    setPlantClass(plantInfoTemp[4]?.toNumber());
  };

  useEffect(() => {
    updateBird();
    updatePlant();
  }, [birdNumber, birdExp]);

  return (
    <div>
      {/* Buttons */}
      <div className="flex flex-col">
        <button className="bg-cyan-500 text-white w-64" onClick={createBird}>
          create bird
        </button>
        <button
          className="bg-cyan-500 text-white w-64 mt-1"
          onClick={createPlant}
        >
          create tree
        </button>
        <button
          className="bg-cyan-500 text-white mt-3 w-64"
          onClick={updateBird}
        >
          update
        </button>
      </div>
      {/* Farm */}
      <h1 className="mt-8">Farm</h1>
      <div className="flex flex-col mt-3">
        <h3 className="">Bird Owned: {birdNumber}</h3>
        <p>name: {birdName}</p>
        <p>ad: {birdAd}</p>
        <p>exp: {birdExp}</p>
        <p>level: {birdLevel}</p>
      </div>
      {/* Plant */}
      <h1 className="mt-8">Plant</h1>
      <div className="flex flex-col mt-3">
        <h3 className="">Plant Owned: {plantHp > 0 ? 1 : 0}</h3>
        <p>hp: {plantHp}</p>
        <p>exp reward: {plantExpReward}</p>
        <p>dead time: {plantDeadTime}</p>
        <p>class: {plantClass}</p>
      </div>
      {/* Attack */}
      <div className="flex flex-col p-0">
        <button
          className="bg-blue-500 text-white w-64 mt-5"
          onClick={feedPlant}
        >
          Attack
        </button>
        <button
          className="bg-blue-500 text-white w-64 mt-5"
          onClick={revivePlant}
        >
          Revive Plant
        </button>
        <button className="bg-blue-500 text-white w-64 mt-5" onClick={levelUp}>
          Level Up Bird
        </button>
      </div>
    </div>
  );
};
