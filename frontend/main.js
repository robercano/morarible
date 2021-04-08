Moralis.initialize("es0nDUuv5bbNckxnHKny54QC4fkJIEJlrFEiP6IW");
Moralis.serverURL = "https://pqfia64esyhg.moralis.io:2053/server";

init = async () => {
    window.web3 = Moralis.Web3.enable();

    initUser();
};

user = null;
initUser = async () => {
    user = await Moralis.User.current();
    if (user) {
        hideElement(userConnectButton);
        showElement(userLogoutButton);
        showElement(userProfileButton);
    } else {
        showElement(userConnectButton);
        hideElement(userLogoutButton);
        hideElement(userProfileButton);
        hideElement(userInfo);
    }
};

login = async () => {
    try {
        await Moralis.Web3.authenticate();

        initUser();
    } catch (error) {
        alert(error);
    }
};

logout = async () => {
    await Moralis.User.logOut();

    closeUserInfo();
    initUser();
};

openUserInfo = async () => {
    if (user) {
        const email = user.get("email");
        if (email) {
            userEmailField.value = email;
        } else {
            userEmailField.value = "";
        }
        userNameField.value = user.get("username");

        const avatar = user.get("avatar");
        if (avatar) {
            userAvatarImage.src = avatar.url();
            showElement(userAvatarImage);
        } else {
            hideElement(userAvatarImage);
        }
        showElement(userInfo);
    } else {
        login();
    }
};

closeUserInfo = async () => {
    hideElement(userInfo);
};

saveUserInfo = async () => {
    user.set("email", userEmailField.value);
    user.set("username", userNameField.value);

    if (userAvatarFile.files.length > 0) {
        const avatar = new Moralis.File("avatar.jpg", userAvatarFile.files[0]);

        user.set("avatar", avatar);
    }

    await user.save();
    alert("User info succesfully saved!");

    openUserInfo();
};

hideElement = (element) => (element.style.display = "none");
showElement = (element) => (element.style.display = "block");

const userConnectButton = document.getElementById("btnConnect");
userConnectButton.onclick = login;

const userLogoutButton = document.getElementById("btnLogout");
userLogoutButton.onclick = logout;

const userProfileButton = document.getElementById("btnUserInfo");
userProfileButton.onclick = openUserInfo;

const userSaveUserInfoButton = document.getElementById("btnSaveUserInfo");
userSaveUserInfoButton.onclick = saveUserInfo;

const userCloseUserInfoButton = document.getElementById("btnCloseUserInfo");
userCloseUserInfoButton.onclick = closeUserInfo;

const userInfo = document.getElementById("userInfo");
const userNameField = document.getElementById("txtUsername");
const userEmailField = document.getElementById("txtEmail");
const userAvatarImage = document.getElementById("imgAvatar");
const userAvatarFile = document.getElementById("fileAvatar");

init();
