#include <algorithm>
#include <chrono>
#include <iostream>
#include <random>
#include <emscripten.h>
#include "game.h"
#include "mcts.h"
const bool AUTO = true;
const int MAX_ACTION_NUM=64;
int path[MAX_ACTION_NUM];
int path_len = 0;
int actions[MAX_ACTION_NUM];
int board[MAX_ACTION_NUM];
int actions_len = 0;
// https://stackoverflow.com/questions/41875728/pass-a-javascript-array-as-argument-to-a-webassembly-function
extern "C"{
    EMSCRIPTEN_KEEPALIVE int cpp_run(){
        vector<Action>temp(path_len);
        for(int i = 0; i < path_len; i++){
            temp[i] = Action(path[i]>>8, path[i]&0xFF);
        }
        MCTS mcts(temp);
        Action a = mcts.run();
        int ret = (a.y << 8) + a.x;
        path[path_len] = ret;
        path_len ++;
        return ret;
    }
    EMSCRIPTEN_KEEPALIVE int* cpp_get_actions_ptr(){
        return actions;
    }
    EMSCRIPTEN_KEEPALIVE int* cpp_get_path_ptr(){
        return path;
    }
    EMSCRIPTEN_KEEPALIVE int cpp_get_actions_len(){
        return actions_len;
    }
    EMSCRIPTEN_KEEPALIVE int cpp_get_path_len(){
        return path_len;
    }
    EMSCRIPTEN_KEEPALIVE void cpp_set_path_len(int len){
        path_len = len;
    }
    EMSCRIPTEN_KEEPALIVE int* cpp_get_board(){
        return board;
    }
    EMSCRIPTEN_KEEPALIVE void cpp_update_actions(){
        Board b;
        vector<Action>temp(path_len);
        for(int i = 0; i < path_len; i++){
            temp[i] = Action(path[i]>>8, path[i]&0xFF);
        }
        b.batch_update(temp);
        vector<Action> a = b.get_actions();
        for(int i = 0; i < a.size(); i++){
            actions[i] =  a[i].x + (a[i].y << 8);
        }
        actions_len = a.size();

        for(int i = 0; i < MAX_ACTION_NUM; i++){
            board[i] = (int)b.s[i/BOARD_SIZE][i%BOARD_SIZE];
        }
    }
}

