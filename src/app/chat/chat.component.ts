import {Component, OnInit, OnDestroy, ChangeDetectorRef, ElementRef, AfterViewInit} from '@angular/core';
import {AuthService} from "../service/auth.service";
import {Subscription} from "rxjs";
import {Message} from "./message";
import {FirebaseService} from "../service/firebase.service";


@Component({
  selector: 'rb-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit,AfterViewInit, OnDestroy {

  private messages: Message[]

  private userAuth = true

  private subscription: Subscription

  private userName: Element

  private messageInput: Element

  constructor(private firebase: FirebaseService, private authService: AuthService, private cd: ChangeDetectorRef, private myElement: ElementRef) {
    this.userAuth = true
    this.messages = new Array<Message>();
  }

  changeBackground() {
    return {'background-image': 'url(' + "http://www.american.edu/uploads/profiles/large/chris_palmer_profile_11.jpg" + ')'};
  }

  ngAfterViewInit(): void {

    this.messagesRef = this.firebase.getInstance().database().ref('messages');

    var hElement: HTMLElement = this.myElement.nativeElement;
    this.userName = hElement.querySelector("#user-name")
    this.messageInput = hElement.querySelector("#message")

    console.log("ngAfterViewInit : ", this.userName)

    this.subscription = this.authService.isAuthenticated().subscribe(
      authStatus => {

        if (authStatus) {
          console.log("user is authent")
          // Set the user's profile pic and name.
          // this.userPic.style.backgroundImage = 'url(' + "http://www.american.edu/uploads/profiles/large/chris_palmer_profile_11.jpg" + ')';
          this.userName.textContent = "toto is here";

          // Show user's profile and sign-out button.
          // Hide sign-in button.

          // We load currently existing chat messages.
          this.loadMessages();

          //load top questions
          // this.recipeService.getTopQuestions().subscribe(
          //   response => {
          //     console.log("top questions response : ", response)
          //   }
          // )

        } else {
          console.log("user is NOT authent")
        }

        this.userAuth = authStatus
        this.cd.detectChanges();

      }
    )
  }


  ngOnInit() {
    var hElement: HTMLElement = this.myElement.nativeElement;
    var test = hElement.querySelector("#user-name")

    console.log("ngOnInit : ", test)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }


  private messagesRef: any

  /**
   * Loads chat messages history and listens for upcoming ones.
   */
  loadMessages() {
    // Make sure we remove all previous listeners.
    this.messagesRef.off();
    // Loads the last 12 messages and listen for new ones.
    var setMessage = function (data) {
      console.log("setMessage, data : ", data)

      var val = data.val();
      this.displayMessage(data.key, val.name, val.text, val.photoUrl, val.imageUrl);
    }.bind(this);

    this.messagesRef.limitToLast(12).on('child_added', setMessage);
    this.messagesRef.limitToLast(12).on('child_changed', setMessage);

  }


  displayMessage(key, name, text, picUrl, imageUri) {
    console.log("displayMessage, key : ", key)
    console.log("displayMessage, name : ", name)

    this.messages.push(new Message(name, text, picUrl, imageUri))

    this.cd.detectChanges();

  }

  // Saves a new message on the Firebase DB.
  saveMessage(text: string) {
    console.debug('saveMessage, input : ', text);

    if (text != null) {

      this.messagesRef.push({
        name: "username",
        text: text,
        // photoUrl: currentUser.photoURL || '/images/profile_placeholder.png'
        photoUrl: 'assets/profile_placeholder.png'
      }).then(function () {
        console.error('message added');

        // Clear message text field and SEND button state.
        // FriendlyChat.resetMaterialTextfield(this.messageInput);
        // this.toggleButton();
      }.bind(this)).catch(function (error) {
        console.error('Error writing new message to Firebase Database', error);
      });

    }
  }

}
