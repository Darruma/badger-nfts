
import { TransferSingle } from '../generated/BadgerERC1155/BadgerERC1155'
import { TransferSingle as TransferSingleMeme} from '../generated/MemeLtd/MemeLtd'
import { User, NFTBalance } from '../generated/schema'
import { BIGINT_ONE,BIGINT_ZERO, MEME_NFT_IDS, ZERO_ADDRESS } from './constants';
import { Address,BigInt } from '@graphprotocol/graph-ts';
import { getOrCreateNFTBalance, getOrCreateUser } from './utils';


export function handleNFTTransfer(event: TransferSingle): void {
   let fromAddress = event.params.to.toHexString()
   let toAddress = event.params.from.toHexString()

   let fromNftBalance = getOrCreateNFTBalance(event.address, event.params.id, fromAddress);
   let toNftBalance = getOrCreateNFTBalance(event.address, event.params.id, toAddress)
   fromNftBalance.amount = fromNftBalance.amount.plus(event.params.value)
   toNftBalance.amount = fromNftBalance.amount.minus(event.params.value)

   toNftBalance.save()
   fromNftBalance.save()
   getOrCreateUser(fromAddress)
   getOrCreateUser(toAddress);

}

export function handleMemeNFTTransfer(event: TransferSingleMeme): void {
  let id = event.params._id
  if (MEME_NFT_IDS.includes(id.toI32())) {
    let fromAddress = event.params._to.toHexString()
    let toAddress = event.params._from.toHexString()

    let fromNftBalance = getOrCreateNFTBalance(event.address, event.params._id, fromAddress);
    let toNftBalance = getOrCreateNFTBalance(event.address, event.params._id, toAddress)
    if (toAddress != ZERO_ADDRESS)
    {
      fromNftBalance.amount = fromNftBalance.amount.plus(event.params._amount)
    }
    toNftBalance.amount = fromNftBalance.amount.minus(event.params._amount)

    toNftBalance.save()
    fromNftBalance.save()
    getOrCreateUser(fromAddress)
    getOrCreateUser(toAddress);
  }

}

