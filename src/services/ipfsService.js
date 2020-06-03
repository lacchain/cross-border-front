import toBuffer from 'blob-to-buffer';
import ipfsAPI from 'ipfs-api';
import bs58 from 'bs58';
import { web3Service } from './web3Service';

export const ipfsService = {
    save,
    ipfsHashToBytes32,
    getIpfsDocumentUrl
};

const ipfs = ipfsAPI(
    process.env.IPFS_HOST,
    process.env.IPFS_PORT,
    {protocol: process.env.IPFS_PROTOCOL}
);

async function save(document) {
    return new Promise((resolve, reject) => toBuffer(document, (err, result) => {
        if (err) {
            reject(err);
        }
        ipfs.add(result).then(result => resolve(result[0]));
    }));
}

function ipfsHashToBytes32(ipfsHash) {
    return web3Service.bytesToHex(bs58.decode(ipfsHash).slice(2));
}

function getIpfsDocumentUrl(uri) {
    return `${process.env.IPFS_PROTOCOL}://${process.env.IPFS_HOST}${uri}`;
}
