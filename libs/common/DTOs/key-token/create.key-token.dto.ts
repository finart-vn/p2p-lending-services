interface CreateKeyTokenDto {
  userId: bigint;
  publicKey: string;
  refreshToken: string;
}

export default CreateKeyTokenDto;
