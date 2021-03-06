// add admin cloud function
const adminForm = document.querySelector('.admin-actions');
adminForm.addEventListener('submit', e => {
    e.preventDefault();
    adminEmail = document.querySelector('#admin-email').value;
    console.log(adminEmail);
    const addAdminRole = functions.httpsCallable('addAdminRole');
    addAdminRole({ email: adminEmail }).then(result =>{
        console.log(result);
    });
})

// listen for auth status changes
auth.onAuthStateChanged(user => {
    if (user) {
        user.getIdTokenResult().then(idTokenResult => {
            console.log(idTokenResult.claims);
        })
        db.collection('guides').onSnapshot(snapshot => {
            setupGuides(snapshot.docs);
            setupUI(user);
        }, err => console.log(err.message));
    } else {
        setupUI();
        setupGuides([]);
    }
});

// create new guide
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('guides').add({
    title: createForm.title.value,
    content: createForm.content.value
    }).then(() => {
    // close the create modal & reset form
    const modal = document.querySelector('#modal-create');
    M.Modal.getInstance(modal).close();
    createForm.reset();
    }).catch(err => {
    console.log(err.message);
    });
});

// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', async(e) => {
    e.preventDefault();

  // get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    await createUserDocument(email, password);

    // closing modal
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset();
});

//create user function
const createUserDocument = async(email, password) => {
    try {
        //getting user from the userAuth
        const { user } = await auth.createUserWithEmailAndPassword(email, password);
        const userRef = db.collection('users').doc(user.uid);
        userRef.set({
            bio: signupForm['signup-bio'].value
        });

    } catch (error) {
        console.log(error.message)
    }
}

// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
});

// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

  // get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

  // log the user in
    auth.signInWithEmailAndPassword(email, password).then((cred) => {
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
});

});