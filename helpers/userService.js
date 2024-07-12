import userModel from "../DB/models/userModel.js";


export const getUserById = async (id)=> userModel.findById(id);

export const getUserByEmail = async (email)=> userModel.findOne({email});

export const getConfirmedUserByEmail = async (email)=> userModel.findOne({email, confirmed: true});


export const updateConfirmed = async (id)=> userModel.findByIdAndUpdate(id, {confirmed: true});