import _ from "lodash";
import { toast } from "react-toastify";
import { ActionType, Store } from "./Store";
import Axios from "axios";
import { Dispatch, ILoomObject} from './Interfaces';
import Web3 from "web3";
import LinkToken from '../contracts/LinkToken.json';
import { transferToken } from "../utils/EthUtil";



const ONE_AS_WEI = '1000000000000000000';


export const notify = (msg: string, success?: boolean) => {
  !success ? toast(msg) : toast.success(msg, { autoClose: false });
};


export const notifyError = (msg: string) => {
  toast.error(msg, { autoClose: false });
};


export const notifyWarn = (msg: string) => {
  if (!toast.isActive("nfId")) {
    toast.warn(msg, { toastId: "nfId" });
  }
};

/*
  direct return
*/
export const rpcStatus = async():Promise<boolean> => {
  try{
    const result = await Axios.get('/api/v1/projects');
    return true;
  }catch (error){
    console.error("Could not connect to server on rpc check");
    return false;
  }
}


export const fetchSkills = async (loomObj: ILoomObject | any, dispatch: Dispatch) => {
  let skillsCount = await loomObj.instance.methods.numberOfSkills().call();
  let skills = [];

  for (let i = 0; i < skillsCount; i++) {
    let nextSkill = await loomObj.instance.methods.skillsList(i).call();
    skills.push(nextSkill);
  }
  dispatch({
    type: ActionType.SET_SKILLS_LIST,
    payload: skills
  });

  return skills;
};


export const transferOneLinkToken = async(web3: Web3, linkTokenContractAddr: string, toAddr: string, fromAddr: string) => {
  let hash = await transferToken(web3, LinkToken, linkTokenContractAddr, ONE_AS_WEI, toAddr, fromAddr);
  console.log(hash);
  notify('transfer successful in block: '+ hash.blockNumber);
  //dispatch lastEthHash
}



