import prisma from "../database/db.js";
import catchErrorFunc from "../utils/catchErrorFunc.js";

export const getUserRecord = catchErrorFunc(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  if (id === userId) {
    let currentUser = await prisma.user.findUnique({
      where: {
        userId,
      },
      include: {
        organisation: true,
        organisations: {
          include: {
            organisation: true,
          },
        },
      },
    });

    return res.status(200).json({
      status: "success",
      message: "<message>",
      data: {
        userId: currentUser.userId,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        phone: currentUser.phone,
      },
    });
  } else {
    const [currentUserOrgs, user] = await Promise.all([
      prisma.userOnOrganisation.findMany({
        where: {
          userId,
        },
        select: {
          orgId: true,
        },
      }),
      prisma.user.findUnique({
        where: {
          userId: id,
        },
        include: {
          organisations: true,
        },
      }),
    ]);

    const currentUserOnlyOrgs = currentUserOrgs.map((org) => org.orgId);

    const match = user.organisations.filter((org) =>
      currentUserOnlyOrgs.includes(org.orgId)
    );

    if (match.length > 0) {
      return res.status(200).json({
        status: "success",
        message: "<message>",
        data: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      });
    } else {
      return res.status(401).json({
        status: "Unauthorized",
        message: "You are not authorized to view this user's information",
        statusCode: 401,
      });
    }
  }
});

export const getAllOrganisations = catchErrorFunc(async (req, res) => {
  const { userId } = req.user;

  const organisations = await prisma.user.findUnique({
    where: {
      userId,
    },
    select: {
      organisations: {
        select: {
          organisation: true,
        },
      },
    },
  });

  res.status(200).json({
    status: "success",
    message: "<message>",
    data: {
      organisations: organisations.organisations.map((org) => org.organisation),
    },
  });
});

export const getOrganisationById = catchErrorFunc(async (req, res) => {
  const { orgId } = req.params;

  const organisation = await prisma.organisation.findUnique({
    where: {
      orgId,
    },
  });

  res.status(200).json({
    status: "success",
    message: "<message>",
    data: {
      ...organisation,
    },
  });
});

export const createOrganisation = catchErrorFunc(async (req, res) => {
  const { userId } = req.user;
  const { name, description } = req.body;

  try {
    const organisation = await prisma.organisation.create({
      data: {
        name,
        description,
        createdBy: userId,
      },
    });

    const addUser = await prisma.userOnOrganisation.create({
      data: {
        userId,
        orgId: organisation.orgId,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Organisation created successfully",
      data: {
        ...organisation,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad Request",
      message: "Client error",
      statusCode: 400,
    });
  }
});

export const addUserToOrganisation = catchErrorFunc(async (req, res) => {
  const { userId } = req.body;

  const { orgId } = req.params;

  const { userId: currentUserId } = req.user;

  const organisation = await prisma.organisation.findUnique({
    where: {
      orgId,
    },
  });

  const addUser = await prisma.userOnOrganisation.create({
    data: {
      userId,
      orgId,
    },
  });

  res.status(200).json({
    status: "success",
    message: "User added to organisation successfully",
  });
});
