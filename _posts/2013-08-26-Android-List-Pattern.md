---
layout: post
title: "Android: Editing Lists of Values"
categories: [technology]
image: tube.jpg
---


I have been working with lists in the Android app I'm working on, and I found that they have a bit of a learning curve. Its always the case in programming - there are some things, that seem like they should be easy, which can often be quite complicated. And, lists are one of those things in Android: not that intuitive; you have to learn to do things the "Android way". However, after coming to understand the tools that the Android framework gives us, we can quite quickly construct a flexible and robust solution.
<!--more-->

###Background - Basic UX 

In keeping with UI patterns on mobile platforms, we should try to keep the screens very simple. So, as a simple phone-centric solution, I created one `Activity` class which would perform all the activities associated with displaying and updating the multivalued attribute. The object containing the list can be passed in and out quite simply as an extra in the `Intent`, as this object implements the `Parcelable` interface.

###Activity Overview

At the top level, the solution breaks down into two parts:  
1. Loading a `ListView` with a customised item view containing `EditText`'s  
2. Assign a custom `Adapter` class which will interface between the elements in the UI and the list we want to manage.  

Now, let's break the problem down in more detail.

###Implementing a `ListView`


Implementing the `ListView` in itself is not so difficult. First we will define a top level layout for our `Activity` to use, which must contain the `ListView` that we will customize. This `ListView` object by itself only can specify how the items in the list are to be presented (eg the alignment of the list) and not the layout of the individual items in the list. As usual, we use `setContentView()` to load the class in our `Activity`. So in my layout resource file below, I take a standard list, and attach to it a header and a footer (defined in external layout files), which will ensure that a button to add additional entries to the list is always present, as well as save and cancel buttons:


	<RelativeLayout  xmlns:android="http://schemas.android.com/apk/res/android"
					android:orientation="vertical"
					 android:layout_width="fill_parent"
					 android:layout_height="fill_parent">
		<include android:id="@+id/header"
				 layout="@layout/list_header_layout"
				 android:layout_width="fill_parent"
				 android:layout_height="wrap_content"
				 android:layout_alignParentTop="true" />
		<include android:id="@+id/footer"
				 layout="@layout/list_footer_layout"
				 android:layout_width="fill_parent"
				 android:layout_height="wrap_content"
				 android:layout_alignParentBottom="true" />
		<ListView android:id="@+id/listinput"
				  android:layout_width="match_parent"
				  android:layout_height="wrap_content"
				  android:layout_below="@id/header"
				  android:layout_above="@id/footer"/>
	</RelativeLayout>

###A Custom Adapter

After loading the layout file, we must find the `ListView` object that is defined here so that we can attach a custom `Adapter` to it in our `Activity`. This `Adapter` will define the layout of the items in the list, and it will take care of initialising and updating those layouts. This class can initially seem a little opaque, though we can come to understand it by analysing the contents. There are some boilerplate methods we must add, but of primary importance is the following method that is used to load the layout of individual items in the list:

	public View getView(int position, View convertView, ViewGroup parent) {
		ViewHolder holder;
		
		if (convertView == null) {
			holder = new ViewHolder();
			convertView = mInflater.inflate(R.layout.listitem_multivalueinput, null);
			holder.attributeValue = (EditText) convertView.findViewById(R.id.attributeValue);
			holder.attributeDeleteButton=(Button)convertView.findViewById(R.id.deleteValueButton);  
			convertView.setTag(holder);
		} else {
			holder = (ViewHolder) convertView.getTag();
		}
		
		//Fill EditText with the value you have in data source
		holder.attributeValue.setText(myAttributes.get(position).toString());
		holder.attributeValue.setTag(position);
		holder.attributeDeleteButton.setTag(position);

		//we need to update adapter once we finish with editing
		holder.attributeValue.setOnFocusChangeListener(new View.OnFocusChangeListener() {
			public void onFocusChange(View v, boolean hasFocus) {
				if (!hasFocus){
					final int position = (Integer) v.getTag();
					final EditText Caption = (EditText) v;
					if (!myAttributes.get(position).equals(Caption.getText().toString())) {
						myAttributes.add(position, Caption.getText().toString());
					}
				}
			}
		});
	   holder.attributeDeleteButton.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				final int position = (Integer) v.getTag();
				myAttributes.remove(position);
				if (myAttributes.size() < 1) {
					myAttributes.add("");
				}
				notifyDataSetChanged();
			}
		});
		return convertView;
	}


There are quite a few things going on here, so lets step through it one by one. Firstly, if we are instantiating a view for the first time, then we need to inflate (load) the view from a layout resource file - which I have defined as `listitem_multivalueinput`. This file is quite simple, it is just a `LinearLayout` containing an `EditText` and a `Button`:

	<?xml version="1.0" encoding="utf-8"?>
	<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
					android:layout_width="fill_parent"
					android:layout_height="wrap_content"
					android:orientation="horizontal">
		<EditText
				android:id="@+id/attributeValue"
				android:layout_width="0dp"
				android:layout_height="wrap_content"
				android:padding="10dp"
				android:textSize="16sp"
				android:layout_weight="7" />
		<Button
				android:id="@+id/deleteValueButton"
				android:layout_width="wrap_content"
				android:layout_height="wrap_content"
				android:text="x"  <!--don't do this-->
				android:width="0dp"
				android:layout_weight="1"
				android:onClick="removeValue"/>
	</LinearLayout>

The next step is to add the `EditText` and `Button` objects to a `ViewHolder` object. `ViewHolder` is a simple class which contains references to our layout objects. It is commonly used as we use it here, to tie the object references directly to the `ListItem` `View`. It is defined as a static class within the `Adapter`:

	static class ViewHolder {
        private EditText attributeValue;
        private Button attributeDeleteButton;
    }

This reduces the number of calls that need to be made to the relatively expensive `findViewbyId()` method. Instead, when updating an existing `View` object, we can just grab the reference and go straight to populating the layout objects.

Finally, once we have added in the initial list value to the `EditText` and added the position directly onto the `EditText` and `Button` objects (as it may be useful to refer to it later!), we will set up the event listeners on the layout objects in the list item. Here we have two:  
- `setFocusOnChangeListener()` on the `EditText`, which will write any altered value back into the underlying list whenever the `EditText` loses focus  
- `setOnClickListener()` on the `Button`, which removes the value at that position and then calls `notifyDataSetChanged()` to force the `ListView` to refresh, in order to reflect the changes  

###What's Left

That covers almost everything - the only thing we have to do now is to decide whether to persist our changes or not. Since changes are being made to our list in realtime as we update the GUI, all we would need to do is save our object and pass it to the next activity - or to cancel changes we can just `Finish()` our `Activity` without needing to do anything else.

###Further Improvements

If we wanted to extend this to make the view format more re-usable, this would be a good feature to include in an Android `Fragment` - it could match the recommended use of fragments for list and details views quite well. Then we could extend this phone-centric solution to make it more suited to tablets as well. But that will be a topic for another day.

##More Reading

[A Comprehensive Guide to ListViews](http://www.vogella.com/articles/AndroidListView/article.html) - with lots of nice diagrams!



