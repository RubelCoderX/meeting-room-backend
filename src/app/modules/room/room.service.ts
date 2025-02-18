import prisma from "../../shared/prisma";

const createRoomIntoDb = async (room: any) => {
  return await prisma.room.create({
    data: room,
  });
};

const getAllRooms = async () => {
  return await prisma.room.findMany();
};

const getSingleRoom = async (roomId: string) => {
  return await prisma.room.findUnique({
    where: { id: roomId },
  });
};

// Check if room exists before updating
const updateRoom = async (roomId: string, roomData: Partial<any>) => {
  const existingRoom = await prisma.room.findUnique({
    where: { id: roomId },
  });

  if (!existingRoom) {
    throw new Error("Room not found");
  }

  return await prisma.room.update({
    where: { id: roomId },
    data: roomData,
  });
};

// Check if room exists before deleting
const deleteRoom = async (roomId: string) => {
  const existingRoom = await prisma.room.findUnique({
    where: { id: roomId },
  });

  if (!existingRoom) {
    throw new Error("Room not found");
  }

  return await prisma.room.delete({
    where: { id: roomId },
  });
};

export const roomService = {
  createRoomIntoDb,
  getAllRooms,
  getSingleRoom,
  updateRoom,
  deleteRoom,
};
