package com.tool.common.utils;

public class Test {
    public static Integer getSortNum(Integer payNum, Integer unPayNum, Integer index, Integer isPurchase){
        Integer sortNum =0;
        if (isPurchase == 1){
            Integer r = (Integer) (index/payNum);
            Integer j = (Integer)(index%payNum);
            if (r <1){
                sortNum = r*payNum+ j+1;
            }else{
                sortNum = r*(payNum+unPayNum)+j+1;
            }
        }else {
            Integer r = (Integer) (index/unPayNum);
            Integer j = (Integer)(index%unPayNum);
            if (r <1){
                sortNum = payNum+r*unPayNum+j+1;
            }else{
                sortNum = payNum+r*(payNum+unPayNum)+j+1;
            }
        }
        return sortNum;
    }

    public static void main(String[] args) {
        int paySize =10;
        int unPaySize = 4;
        Integer payNum = 3;
        Integer unPayNum = 2;

        if (paySize / payNum <= unPaySize / unPayNum) {
            Integer lastPayNum=0;
            for (int index = 0; index < paySize; index++) {
                Integer sortNum = Test.getSortNum(payNum, unPayNum, index, 1);
                if (index== paySize-1){
                    lastPayNum = sortNum;
                }
                System.out.println("pay index=" + index + ", sortNum=" + sortNum);
            }
            System.out.println("pay lastPayNum=" + lastPayNum);

            Integer lastUnPayNum = 0;
            Integer lastUnPayIndex = (paySize / payNum )*unPayNum -1;
            if (paySize%payNum==0){
                lastUnPayIndex = (paySize / payNum-1 )*unPayNum -1;
            }
            System.out.println("lastUnPayIndex="+lastUnPayIndex);
            for (int index = 0; index < unPaySize; index++) {
                Integer sortNum = Test.getSortNum(payNum, unPayNum, index, 0);

                if (index == lastUnPayIndex) {
                    lastUnPayNum = sortNum;
                }
                if (index> lastUnPayIndex){
                    sortNum = lastPayNum+(index-lastUnPayIndex);
                }
                System.out.println("unpay index=" + index + ", sortNum=" + sortNum);
            }
            System.out.println("unpay lastUnPayNum=" + lastUnPayNum);
        }else{
            Integer lastUnPayNum = 0;
            for (int index = 0; index < unPaySize; index++) {
                Integer sortNum = Test.getSortNum(payNum, unPayNum, index, 0);
                if (index == unPaySize-1) {
                    lastUnPayNum = sortNum;
                }
                System.out.println("unpay index=" + index + ", sortNum=" + sortNum);
            }
            System.out.println("unpay lastUnPayNum=" + lastUnPayNum);

            Integer lastPayNum = 0;
            Integer lastPayIndex = (unPaySize / unPayNum+1 )*payNum -1;
            if (unPaySize%unPayNum==0){
                lastPayIndex = (unPaySize / unPayNum)*payNum -1;
            }
            System.out.println("lastPayIndex="+lastPayIndex);
            for (int index = 0; index < paySize; index++) {
                Integer sortNum = Test.getSortNum(payNum, unPayNum, index, 1);

                if (index == lastPayIndex) {
                    lastPayNum = sortNum;
                }
                if (index> lastPayIndex){
                    sortNum = lastUnPayNum+(index-lastPayIndex);
                }
                System.out.println("pay index=" + index + ", sortNum=" + sortNum);
            }
            System.out.println("pay lastPayNum=" + lastPayNum);
        }
    }
}
