rm -rf build
mkdir build
cd build
em++ ../export.cpp ../mcts.cpp -s WASM=1 --no-entry -O3 -o mcts.js -s NO_EXIT_RUNTIME=1 -s "EXPORTED_RUNTIME_METHODS=['cwrap']" || exit 1
mv mcts.wasm ../web/gen/
mv mcts.js ../web/gen/