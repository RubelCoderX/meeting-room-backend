import { Prisma } from "@prisma/client";
import prisma from "../../shared/prisma";

const createRoomIntoDb = async (room: any) => {
  return await prisma.room.create({
    data: room,
  });
};

const getAllRooms = async (params: any) => {
  const queryCondition: Prisma.RoomWhereInput[] = [];
  if (params.searchTerm) {
    queryCondition.push({
      name: {
        contains: params.searchTerm,
        mode: "insensitive",
      },
    });
  }
  // Filter by capacity (e.g., minimum capacity)
  if (params.capacity) {
    queryCondition.push({
      capacity: {
        lte: Number(params.capacity),
      },
    });
  }

  const whereCodeition: Prisma.RoomWhereInput = { AND: queryCondition };
  return await prisma.room.findMany({
    where: whereCodeition,
  });
};

const getSingleRoom = async (roomId: string) => {
  return await prisma.room.findUnique({
    where: { id: roomId },
  });
};

// Valid fields based on your Prisma schema
const validFields = ["name", "capacity", "image", "amenities"];

const updateRoom = async (roomId: string, roomData: Partial<any>) => {
  try {
    // Check if the room exists
    const existingRoom = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!existingRoom) {
      throw new Error("Room not found");
    }

    const updateData = Object.fromEntries(
      Object.entries(roomData).filter(([key]) => validFields.includes(key))
    );

    if (Object.keys(updateData).length === 0) {
      throw new Error("No valid fields to update");
    }
    // Update the room
    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: updateData,
    });

    return updatedRoom;
  } catch (error) {
    console.error("Error updating room:", error);
    throw error;
  }
};

export default updateRoom;

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
