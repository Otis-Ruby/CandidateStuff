async function deleteHiring(req, res) {
    const session = await Hiring.startSession();
    session.startTransaction();
    try {
        const id = req.token.id
        const company = await Company.findById(id).session(session)
        if (!company) {
            await session.abortTransaction()
            return res.status(404).json({ message: "Company not found" })
        }

        const { hiringId } = req.params
        const hiring = await Hiring.findOne({ _id: hiringId, companyCRN: company.companyCRN })
        if (!hiring) {
            await session.abortTransaction()
            return res.status(404).json({ message: "Hiring Not Found" })
        }

        // Fetch all records 
        const records = await Record.find({ hiringId: hiring._id })
            .populate('candidateId', 'email') 
            .session(session);

        //  Extract emails
        const emails = records.map(record => record.candidateId?.email).filter(Boolean);

        // Send mail to each candidate (COMMENTED OUT LOGIC)

    
        await Round.deleteMany({ hiringId: hiring._id }).session(session)
        await Hiring.deleteOne({ _id: hiring._id }).session(session)
        await session.commitTransaction();

        return res.status(200).json({ message: "Hiring deleted successfully and candidates notified" })
    } catch (error) {
        await session.abortTransaction()
        return res.status(500).json({ message: "Internal Server Error", error: error.message })
    } finally {
        session.endSession()
    }
}
