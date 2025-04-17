import { ethers } from "ethers";

const IERC165_ABI = [
  "function supportsInterface(bytes4 interfaceId) external view returns (bool)",
];

const ERC721_ABI = ["function balanceOf(address owner) view returns (uint256)"];

const ERC1155_ABI = [
  "function balanceOf(address account, uint256 id) view returns (uint256)",
];

const ERC721_INTERFACE_ID = "0x80ac58cd";
const ERC1155_INTERFACE_ID = "0xd9b67a26";

export async function detectERCStandard(
  address: string,
  provider: ethers.Provider
) {
  const contract = new ethers.Contract(address, IERC165_ABI, provider);

  try {
    const [isERC721, isERC1155] = await Promise.all([
      contract.supportsInterface(ERC721_INTERFACE_ID),
      contract.supportsInterface(ERC1155_INTERFACE_ID),
    ]);

    return {
      isERC721,
      isERC1155,
    };
  } catch (err) {
    console.error("Error checking interface:", err);
    return {
      isERC721: false,
      isERC1155: false,
    };
  }
}

export async function getERC721Balance(
  owner: string,
  contractAddress: string,
  provider: ethers.Provider
): Promise<bigint> {
  const contract = new ethers.Contract(contractAddress, ERC721_ABI, provider);
  return await contract.balanceOf(owner);
}

export async function getERC1155Balance(
  owner: string,
  contractAddress: string,
  tokenId: number,
  provider: ethers.Provider
): Promise<bigint> {
  const contract = new ethers.Contract(contractAddress, ERC1155_ABI, provider);
  return await contract.balanceOf(owner, tokenId);
}
