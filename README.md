**Building the docker image**
docker build -t ground-station .

**Running the docker image in a container once built**
docker run -p 9000:9000 ground-station

Then open http://localhost:9000

**Or, with docker compose (build + run in one step)**
docker compose up --build
