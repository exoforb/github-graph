import { simpleGit } from "simple-git";
import { writeFile } from "jsonfile";
import moment from "moment";
import random from "random";

const FILE_PATH = "./data.json";

// Initialize simple-git for your repo
const git = simpleGit(process.cwd());

const makeCommit = async (n) => {
  if (n === 0) {
    try {
      await git.push("origin", "master", { "-u": null });
      console.log("All changes pushed to remote repository");
    } catch (err) {
      console.error("Error pushing to remote:", err);
    }
    return;
  }

  const x = random.int(0, 54); // weeks
  const y = random.int(0, 6); // days
  const z = random.int(0, 1); // random 0 or 1 year ago
  const DATE = moment()
    .subtract(z, "y")
    .subtract(x, "w")
    .subtract(y, "d")
    .format();

  const data = { date: DATE };
  console.log("Committing for date:", DATE);

  try {
    await writeFile(FILE_PATH, data);

    await git.add([FILE_PATH]);
    await git.commit(DATE, { "--date": DATE });

    console.log(`Committed: ${DATE}`);
    await makeCommit(n - 1); // recursive call
  } catch (err) {
    console.error("Error during commit process:", err);
  }
};

// Start committing
makeCommit(200);
